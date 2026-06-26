import { ref, type Ref } from 'vue';
import type { AbVariant, AlbaPageContext, AlbaSessionInit } from '../lib/alba/session-types';

const LS_UID_KEY = 'alba_uid';
const LS_VARIANT_KEY = 'alba_variant';

let singleton: ReturnType<typeof create> | null = null;

function create() {
  const uid: Ref<string> = ref('');
  const sessionId: Ref<string | null> = ref(null);
  const variant: Ref<AbVariant | null> = ref(null);
  const initializing: Ref<boolean> = ref(false);

  if (typeof localStorage !== 'undefined') {
    let stored = localStorage.getItem(LS_UID_KEY);
    if (!stored) {
      stored = crypto.randomUUID();
      localStorage.setItem(LS_UID_KEY, stored);
    }
    uid.value = stored;
    const storedVariant = localStorage.getItem(LS_VARIANT_KEY);
    if (storedVariant === 'proactive' || storedVariant === 'reactive') {
      variant.value = storedVariant;
    }
  }

  async function initSession(page: AlbaPageContext): Promise<void> {
    if (initializing.value || !uid.value) return;
    initializing.value = true;
    try {
      const res = await fetch('/api/alba/session-init', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ uid: uid.value, page_origin: page.url }),
      });
      if (!res.ok) throw new Error('session-init failed: ' + res.status);
      const data = (await res.json()) as AlbaSessionInit;
      sessionId.value = data.session_id;
      variant.value = data.ab_variant;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LS_VARIANT_KEY, data.ab_variant);
      }
    } finally {
      initializing.value = false;
    }
  }

  return { uid, sessionId, variant, initializing, initSession };
}

export function useAlbaSession() {
  if (!singleton) singleton = create();
  return singleton;
}

// Solo per i test
export function _resetForTests(): void {
  singleton = null;
}
