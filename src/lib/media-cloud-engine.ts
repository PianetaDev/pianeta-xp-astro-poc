/**
 * Pianeta Media Cloud Engine — motore visivo Three.js per l'archivio foto.
 *
 * Classe TS pura, zero dipendenze React/Vue. Monta su un HTMLDivElement
 * qualsiasi; il wrapper Vue (MediaCloud.vue) fornisce il punto di montaggio
 * come Astro island. Stessa architettura sprite-cloud di Bosco Watchers ma
 * adattata per i case study Pianeta (tassonomia project_slug + tags, nessun
 * riferimento a workshop/kg_pillars Bosco).
 *
 * Feature future annotate (NON implementate qui):
 *   - Selezione multipla + export come animazione/video (ispirazione: spiral.soot.com)
 */
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MediaUsage {
  id: string;
  content_type: 'work' | 'bulletin' | 'services' | 'lab' | 'team' | 'careers';
  content_slug: string;
  field: 'cover' | 'inline' | 'og' | 'thumbnail';
}

export interface MediaPhoto {
  id: string;
  storage_path: string;
  thumbnail_path: string | null;
  caption: string | null;
  pos_x: number | null;
  pos_y: number | null;
  color_avg_hex: string | null;
  /** Cache per il clustering Three.js — fonte di verità: pianeta_media_usages */
  project_slug: string | null;
  tags: string[];
  is_favorite: boolean;
  metadata: Record<string, unknown>;
  photographer: string | null;
  captured_at: string | null;
  /** Pagine del sito che usano questa foto (many-to-many) */
  pianeta_media_usages: MediaUsage[];
}

export interface CloudEngineOptions {
  /** Container element to attach the Three.js renderer to */
  container: HTMLDivElement;
  /** Thumbnail URL resolver — allows same-origin proxy for Supabase CDN */
  thumbUrl: (path: string) => string;
  /** Called when a photo sprite is clicked */
  onPhotoClick?: (photo: MediaPhoto) => void;
  /** Called when a project label sprite is clicked */
  onProjectClick?: (projectSlug: string) => void;
}

// ---------------------------------------------------------------------------
// Declutter — pairwise repulsion for sprite positions
// ---------------------------------------------------------------------------

interface DeclutterPoint {
  id: string;
  x: number;
  y: number;
}

function idDirection(a: string, b: string): { x: number; y: number } {
  let h = 0;
  const key = a < b ? a + b : b + a;
  for (let i = 0; i < key.length; i++) {
    h = (h << 5) - h + key.charCodeAt(i);
    h |= 0;
  }
  const angle = ((h >>> 0) / 4294967295) * Math.PI * 2;
  return { x: Math.cos(angle), y: Math.sin(angle) };
}

function declutter<P extends DeclutterPoint>(
  points: P[],
  minDist: number | ((a: P, b: P) => number),
  maxIterations = 200,
): P[] {
  const minDistFor = typeof minDist === 'function' ? minDist : () => minDist;
  const result = points.map((p) => ({ ...p }));
  for (let iter = 0; iter < maxIterations; iter++) {
    let movedAny = false;
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        const d = minDistFor(result[i], result[j]);
        const dx = result[j].x - result[i].x;
        const dy = result[j].y - result[i].y;
        const dist = Math.hypot(dx, dy);
        if (dist >= d) continue;
        movedAny = true;
        const ux = dist > 1e-6 ? dx / dist : idDirection(result[i].id, result[j].id).x;
        const uy = dist > 1e-6 ? dy / dist : idDirection(result[i].id, result[j].id).y;
        const push = (d - dist) / 2;
        result[i].x -= ux * push;
        result[i].y -= uy * push;
        result[j].x += ux * push;
        result[j].y += uy * push;
      }
    }
    if (!movedAny) break;
  }
  return result;
}

// ---------------------------------------------------------------------------
// Label sprite helpers
// ---------------------------------------------------------------------------

const LABEL_FONT_SIZE = 44;
const LABEL_WORLD_HEIGHT = 12;
const LABEL_STROKE_WIDTH = 7;

function measureLabelCanvasSize(text: string): { width: number; height: number } {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  ctx.font = `600 ${LABEL_FONT_SIZE}px "Helvetica Neue", Arial, sans-serif`;
  const textWidth = ctx.measureText(text).width;
  return {
    width: Math.ceil(textWidth + LABEL_STROKE_WIDTH * 2),
    height: Math.ceil(LABEL_FONT_SIZE * 1.3 + LABEL_STROKE_WIDTH * 2),
  };
}

function makeLabelSprite(text: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const { width: w, height: h } = measureLabelCanvasSize(text);
  canvas.width = w;
  canvas.height = h;
  ctx.font = `600 ${LABEL_FONT_SIZE}px "Helvetica Neue", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const cx = w / 2;
  const cy = h / 2;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#fafaf7';
  ctx.lineWidth = LABEL_STROKE_WIDTH;
  ctx.strokeText(text, cx, cy);
  ctx.fillStyle = '#0e1116';
  ctx.fillText(text, cx, cy);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(LABEL_WORLD_HEIGHT * (w / h), LABEL_WORLD_HEIGHT, 1);
  sprite.renderOrder = 1;
  return sprite;
}

function measureLabelWorldSize(text: string) {
  const { width: w, height: h } = measureLabelCanvasSize(text);
  return { width: LABEL_WORLD_HEIGHT * (w / h), height: LABEL_WORLD_HEIGHT };
}

// ---------------------------------------------------------------------------
// Hash helpers
// ---------------------------------------------------------------------------

function hash01(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return (h >>> 0) / 4294967295;
}

// ---------------------------------------------------------------------------
// Main engine class
// ---------------------------------------------------------------------------

const MIN_SPRITE_SPACING = 32;
const CROWN_SHYNESS_GAP = 80;

type SpriteTarget = { id: string; x: number; y: number; project_slug?: string };

export class MediaCloudEngine {
  private el: HTMLDivElement;
  private thumbUrl: (path: string) => string;
  private onPhotoClick?: (photo: MediaPhoto) => void;
  private onProjectClick?: (slug: string) => void;

  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private renderer!: THREE.WebGLRenderer;
  private sprites = new Map<string, THREE.Sprite>();
  private projectLabels = new Map<string, THREE.Sprite>();

  private camState = { zoom: 1, panX: 0, panY: 0 };
  private cameraTarget = { zoom: 1, panX: 0, panY: 0 };
  private hasFitCamera = false;
  private overviewCamera = { panX: 0, panY: 0 };
  private lastFilter: { projectFilter: string | null; matchedIds: Set<string> | null } = {
    projectFilter: null,
    matchedIds: null,
  };

  private photos: MediaPhoto[] = [];
  private photosRef: MediaPhoto[] = [];
  private projectFilter: string | null = null;
  private matchedIds: Set<string> | null = null;
  private showLanding = true;

  private raf = 0;
  private resizeObserver!: ResizeObserver;
  private dragStart = { x: 0, y: 0, panX: 0, panY: 0 };
  private dragging = false;
  private dragDistPx = 0;
  private activePointers = new Map<number, { x: number; y: number }>();
  private pinchStartDist = 0;
  private pinchStartZoom = 1;

  constructor(opts: CloudEngineOptions) {
    this.el = opts.container;
    this.thumbUrl = opts.thumbUrl;
    this.onPhotoClick = opts.onPhotoClick;
    this.onProjectClick = opts.onProjectClick;
    this.initScene();
    this.bindEvents();
  }

  // ---- Scene init --------------------------------------------------------

  private initScene() {
    const el = this.el;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafaf7);
    this.scene = scene;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    camera.position.z = 10;
    this.camera = camera;
    this.applyCamera();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);
    this.renderer = renderer;

    const EASE = 0.14;
    const tick = () => {
      this.camState.zoom += (this.cameraTarget.zoom - this.camState.zoom) * EASE;
      this.camState.panX += (this.cameraTarget.panX - this.camState.panX) * EASE;
      this.camState.panY += (this.cameraTarget.panY - this.camState.panY) * EASE;
      this.applyCamera();

      const POS_EASE = 0.12;
      for (const sprite of this.sprites.values()) {
        const tx = sprite.userData.targetX as number | undefined;
        const ty = sprite.userData.targetY as number | undefined;
        if (typeof tx === 'number' && typeof ty === 'number') {
          sprite.position.x += (tx - sprite.position.x) * POS_EASE;
          sprite.position.y += (ty - sprite.position.y) * POS_EASE;
        }
      }
      renderer.render(scene, camera);
      this.raf = requestAnimationFrame(tick);
    };
    tick();
  }

  private frustum() {
    const aspect = this.el.clientWidth / this.el.clientHeight;
    const halfHeight = 400 / this.camState.zoom;
    return { halfWidth: halfHeight * aspect, halfHeight };
  }

  private applyCamera() {
    const { halfWidth, halfHeight } = this.frustum();
    this.camera.left = this.camState.panX - halfWidth;
    this.camera.right = this.camState.panX + halfWidth;
    this.camera.top = this.camState.panY + halfHeight;
    this.camera.bottom = this.camState.panY - halfHeight;
    this.camera.updateProjectionMatrix();
  }

  private screenToWorld(clientX: number, clientY: number) {
    const rect = this.el.getBoundingClientRect();
    const { halfWidth, halfHeight } = this.frustum();
    const nx = (clientX - rect.left) / rect.width;
    const ny = (clientY - rect.top) / rect.height;
    return {
      x: this.camState.panX - halfWidth + nx * halfWidth * 2,
      y: this.camState.panY + halfHeight - ny * halfHeight * 2,
    };
  }

  private zoomTowards(clientX: number, clientY: number, newZoom: number) {
    const MAX_ZOOM = 8;
    const MIN_ZOOM = 0.15;
    const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoom));
    const before = this.screenToWorld(clientX, clientY);
    this.cameraTarget.zoom = clamped;
    const rect = this.el.getBoundingClientRect();
    const halfHeight = 400 / clamped;
    const halfWidth = halfHeight * (rect.width / rect.height);
    const nx = (clientX - rect.left) / rect.width;
    const ny = (clientY - rect.top) / rect.height;
    this.cameraTarget.panX = before.x - (nx * halfWidth * 2 - halfWidth);
    this.cameraTarget.panY = before.y - (halfHeight - ny * halfHeight * 2);
  }

  // ---- Event binding -----------------------------------------------------

  private bindEvents() {
    const el = this.el;
    el.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
    el.addEventListener('wheel', this.onWheel, { passive: false });
    el.addEventListener('click', this.onClick);
    el.addEventListener('dblclick', this.onDoubleClick);
    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(el);
  }

  private onPointerDown = (e: PointerEvent) => {
    this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.activePointers.size === 2) {
      this.dragging = false;
      const [a, b] = [...this.activePointers.values()];
      this.pinchStartDist = Math.hypot(a.x - b.x, a.y - b.y);
      this.pinchStartZoom = this.cameraTarget.zoom;
      return;
    }
    this.dragging = true;
    this.dragDistPx = 0;
    this.dragStart = { x: e.clientX, y: e.clientY, panX: this.camState.panX, panY: this.camState.panY };
    this.cameraTarget.panX = this.camState.panX;
    this.cameraTarget.panY = this.camState.panY;
  };

  private onPointerMove = (e: PointerEvent) => {
    if (this.activePointers.has(e.pointerId)) {
      this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }
    if (this.activePointers.size === 2) {
      const [a, b] = [...this.activePointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (this.pinchStartDist > 0) {
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        this.zoomTowards(midX, midY, this.pinchStartZoom * (dist / this.pinchStartDist));
      }
      return;
    }
    if (!this.dragging) return;
    this.dragDistPx = Math.max(
      this.dragDistPx,
      Math.hypot(e.clientX - this.dragStart.x, e.clientY - this.dragStart.y),
    );
    const { halfHeight } = this.frustum();
    const worldPerPixel = (halfHeight * 2) / this.el.clientHeight;
    const panX = this.dragStart.panX - (e.clientX - this.dragStart.x) * worldPerPixel;
    const panY = this.dragStart.panY + (e.clientY - this.dragStart.y) * worldPerPixel;
    this.camState.panX = panX;
    this.camState.panY = panY;
    this.cameraTarget.panX = panX;
    this.cameraTarget.panY = panY;
  };

  private onPointerUp = (e: PointerEvent) => {
    this.activePointers.delete(e.pointerId);
    this.dragging = this.activePointers.size === 1;
    if (this.dragging) {
      const [remaining] = [...this.activePointers.values()];
      this.dragStart = { x: remaining.x, y: remaining.y, panX: this.camState.panX, panY: this.camState.panY };
      this.dragDistPx = 0;
    }
    this.pinchStartDist = 0;
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const factor = Math.exp(-e.deltaY * 0.006);
    this.zoomTowards(e.clientX, e.clientY, this.cameraTarget.zoom * factor);
  };

  private onDoubleClick = (e: MouseEvent) => {
    this.zoomTowards(e.clientX, e.clientY, this.cameraTarget.zoom * 1.9);
  };

  private onClick = (e: MouseEvent) => {
    const CLICK_DRAG_TOLERANCE_PX = 6;
    if (this.dragDistPx > CLICK_DRAG_TOLERANCE_PX) return;

    const CLICK_RADIUS_PX = 26;
    const rect = this.el.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const projected = new THREE.Vector3();

    // Check photo sprites first
    let closestId: string | null = null;
    let closestDistSq = Infinity;
    for (const sprite of this.sprites.values()) {
      projected.copy(sprite.position).project(this.camera);
      const screenX = ((projected.x + 1) / 2) * rect.width;
      const screenY = ((1 - projected.y) / 2) * rect.height;
      const distSq = (screenX - clickX) ** 2 + (screenY - clickY) ** 2;
      if (distSq < closestDistSq) {
        closestDistSq = distSq;
        closestId = sprite.userData.photoId as string;
      }
    }
    if (closestId && closestDistSq <= CLICK_RADIUS_PX ** 2) {
      const photo = this.photosRef.find((p) => p.id === closestId);
      if (photo) this.onPhotoClick?.(photo);
      return;
    }

    // Check project labels
    const LABEL_CLICK_RADIUS_PX = 50;
    let closestSlug: string | null = null;
    let closestLabelDistSq = Infinity;
    for (const sprite of this.projectLabels.values()) {
      if (!sprite.visible) continue;
      projected.copy(sprite.position).project(this.camera);
      const screenX = ((projected.x + 1) / 2) * rect.width;
      const screenY = ((1 - projected.y) / 2) * rect.height;
      const distSq = (screenX - clickX) ** 2 + (screenY - clickY) ** 2;
      if (distSq < closestLabelDistSq) {
        closestLabelDistSq = distSq;
        closestSlug = sprite.userData.projectSlug as string;
      }
    }
    if (closestSlug && closestLabelDistSq <= LABEL_CLICK_RADIUS_PX ** 2) {
      this.onProjectClick?.(closestSlug);
    }
  };

  private onResize = () => {
    this.renderer.setSize(this.el.clientWidth, this.el.clientHeight);
    this.applyCamera();
  };

  // ---- Public API --------------------------------------------------------

  /**
   * Update photos and recompute sprite layout. Call whenever the photo list
   * or active filter changes.
   */
  updatePhotos(
    photos: MediaPhoto[],
    opts: {
      projectFilter: string | null;
      matchedIds: Set<string> | null;
      showLanding: boolean;
    },
  ) {
    this.photos = photos;
    this.photosRef = photos;
    this.projectFilter = opts.projectFilter;
    this.matchedIds = opts.matchedIds;
    this.showLanding = opts.showLanding;
    this.rebuildScene();
  }

  private setsEqual(a: Set<string> | null, b: Set<string> | null): boolean {
    if (a === b) return true;
    if (a === null || b === null || a.size !== b.size) return false;
    for (const v of a) if (!b.has(v)) return false;
    return true;
  }

  private rebuildScene() {
    const photos = this.photos;
    const projectFilter = this.projectFilter;
    const matchedIds = this.matchedIds;

    type Target = SpriteTarget;
    const raw: Target[] = photos
      .map((p): Target | null => {
        if (p.pos_x == null || p.pos_y == null) return null;
        return { id: p.id, x: p.pos_x, y: p.pos_y, project_slug: p.project_slug ?? undefined };
      })
      .filter((p): p is Target => p !== null);

    const targets = new Map(
      declutter(raw, (a, b) =>
        a.project_slug && b.project_slug && a.project_slug !== b.project_slug
          ? CROWN_SHYNESS_GAP
          : MIN_SPRITE_SPACING,
      ).map((p) => [p.id, p]),
    );

    const isFiltered = matchedIds !== null || projectFilter !== null;
    const filterChanged =
      projectFilter !== this.lastFilter.projectFilter ||
      !this.setsEqual(matchedIds, this.lastFilter.matchedIds);
    const wasFiltered = this.lastFilter.projectFilter !== null || this.lastFilter.matchedIds !== null;

    if (isFiltered) {
      const visibleTargets = photos
        .filter((p) => (matchedIds === null || matchedIds.has(p.id)) && (projectFilter === null || p.project_slug === projectFilter))
        .map((p) => targets.get(p.id))
        .filter((t): t is Target => t !== undefined);
      if (visibleTargets.length > 0) {
        const cx = visibleTargets.reduce((s, p) => s + p.x, 0) / visibleTargets.length;
        const cy = visibleTargets.reduce((s, p) => s + p.y, 0) / visibleTargets.length;
        const COMPACT = 0.5;
        for (const t of visibleTargets) {
          targets.set(t.id, { ...t, x: cx + (t.x - cx) * COMPACT, y: cy + (t.y - cy) * COMPACT });
        }
        if (filterChanged) {
          this.cameraTarget.panX = cx;
          this.cameraTarget.panY = cy;
        }
      }
    } else if (wasFiltered && this.hasFitCamera) {
      this.cameraTarget.panX = this.overviewCamera.panX;
      this.cameraTarget.panY = this.overviewCamera.panY;
    }
    this.lastFilter = { projectFilter, matchedIds };

    // Project labels
    {
      const sums = new Map<string, { x: number; y: number; n: number; photoIds: string[] }>();
      for (const photo of photos) {
        if (photo.pos_x == null || photo.pos_y == null || !photo.project_slug) continue;
        const target = targets.get(photo.id);
        if (!target) continue;
        const isVisible =
          (matchedIds === null || matchedIds.has(photo.id)) &&
          (projectFilter === null || photo.project_slug === projectFilter);
        if (!isVisible) continue;
        const entry = sums.get(photo.project_slug) ?? { x: 0, y: 0, n: 0, photoIds: [] };
        entry.x += target.x;
        entry.y += target.y;
        entry.n += 1;
        entry.photoIds.push(photo.id);
        sums.set(photo.project_slug, entry);
      }

      const seenSlugs = new Set<string>();
      for (const [slug, { x, y, n }] of sums) {
        seenSlugs.add(slug);
        const labelX = x / n;
        const labelY = y / n;
        const { width: lw, height: lh } = measureLabelWorldSize(slug);
        const marginX = lw / 2 + 6;
        const marginY = lh / 2 + 6;

        // Push photos out from label keep-out zone
        for (const [, target] of targets) {
          const dx = target.x - labelX;
          const dy = target.y - labelY;
          if (Math.abs(dx) < marginX && Math.abs(dy) < marginY) {
            const pushX = marginX - Math.abs(dx);
            const pushY = marginY - Math.abs(dy);
            if (pushX < pushY) {
              target.x = labelX + Math.sign(dx || 1) * marginX;
            } else {
              target.y = labelY + Math.sign(dy || 1) * marginY;
            }
          }
        }

        let sprite = this.projectLabels.get(slug);
        if (!sprite) {
          sprite = makeLabelSprite(slug);
          sprite.userData.projectSlug = slug;
          this.scene.add(sprite);
          this.projectLabels.set(slug, sprite);
        }
        sprite.position.set(labelX, labelY, 1);
        sprite.visible = true;
      }
      for (const [slug, sprite] of this.projectLabels) {
        if (!seenSlugs.has(slug)) {
          this.scene.remove(sprite);
          this.projectLabels.delete(slug);
        }
      }
    }

    const loader = new THREE.TextureLoader();
    for (const photo of photos) {
      const target = targets.get(photo.id);
      if (!target) continue;

      let sprite = this.sprites.get(photo.id);
      const isNew = !sprite;
      if (!sprite) {
        const material = new THREE.SpriteMaterial({ color: 0xdddddd, transparent: true });
        sprite = new THREE.Sprite(material);
        sprite.scale.set(18, 18, 1);
        sprite.userData.photoId = photo.id;
        this.scene.add(sprite);
        this.sprites.set(photo.id, sprite);
        if (photo.thumbnail_path) {
          loader.load(
            this.thumbUrl(photo.thumbnail_path),
            (texture) => {
              texture.colorSpace = THREE.SRGBColorSpace;
              material.map = texture;
              material.color.set(0xffffff);
              material.needsUpdate = true;
              const img = texture.image as HTMLImageElement;
              const aspect = img.width / img.height;
              sprite!.scale.set(18 * aspect, 18, 1);
            },
            undefined,
            (err) => console.error(`MediaCloud: thumbnail load failed for ${photo.id}`, err),
          );
        }
      }
      if (isNew) sprite.position.set(target.x, target.y, 0);
      sprite.userData.targetX = target.x;
      sprite.userData.targetY = target.y;
      sprite.visible =
        (matchedIds === null || matchedIds.has(photo.id)) &&
        (projectFilter === null || photo.project_slug === projectFilter);
    }

    // Initial camera fit (once, after landing is dismissed)
    if (!this.hasFitCamera && !this.showLanding) {
      const positioned = isFiltered
        ? photos
            .filter(
              (p) =>
                (matchedIds === null || matchedIds.has(p.id)) &&
                (projectFilter === null || p.project_slug === projectFilter),
            )
            .map((p) => targets.get(p.id))
            .filter((t): t is Target => t !== undefined)
        : Array.from(targets.values());
      if (positioned.length > 0) {
        const cx = positioned.reduce((s, p) => s + p.x, 0) / positioned.length;
        const cy = positioned.reduce((s, p) => s + p.y, 0) / positioned.length;
        const INITIAL_ZOOM = 4.5;
        this.cameraTarget.panX = cx;
        this.cameraTarget.panY = cy;
        this.cameraTarget.zoom = INITIAL_ZOOM;
        this.camState.panX = cx;
        this.camState.panY = cy;
        this.camState.zoom = INITIAL_ZOOM * 0.6;
        this.overviewCamera.panX = cx;
        this.overviewCamera.panY = cy;
        this.hasFitCamera = true;
      }
    }
  }

  /** Pan camera to a specific photo's world position */
  panToPhoto(photo: MediaPhoto) {
    if (photo.pos_x == null || photo.pos_y == null) return;
    this.cameraTarget.panX = photo.pos_x;
    this.cameraTarget.panY = photo.pos_y;
  }

  /** Dismiss the landing gate and trigger the camera fit animation */
  dismissLanding() {
    this.showLanding = false;
    this.rebuildScene();
  }

  /** Clean up Three.js resources and event listeners */
  destroy() {
    cancelAnimationFrame(this.raf);
    this.el.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
    this.el.removeEventListener('wheel', this.onWheel);
    this.el.removeEventListener('click', this.onClick);
    this.el.removeEventListener('dblclick', this.onDoubleClick);
    this.resizeObserver.disconnect();
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode === this.el) {
      this.el.removeChild(this.renderer.domElement);
    }
  }
}
