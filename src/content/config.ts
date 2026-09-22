import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const baseSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  ogImage: z.string().optional(),
  cover: z.string().optional(),
  date: z.coerce.date().optional(),
  draft: z.boolean().optional().default(false),
  locale: z.enum(['it', 'en']).optional(),
  tags: z.array(z.string()).optional(),
}).passthrough();

// Embed di un post o reel dentro un caso studio / articolo bulletin
const embedSchema = z.object({
  type: z.enum(['post', 'reel']),
  slug: z.string(),
});

// Schemi per le nuove collezioni atomiche
const postsSchemaExt = baseSchema.extend({
  /** ID di righe pianeta_media_photos (Pianeta.Watchers), in ordine di swipe */
  photoIds: z.array(z.string().uuid()).min(1),
  /** Stessa etichetta libera usata da work; chiave di deduplica in home */
  client: z.string().optional(),
  embeds: z.array(embedSchema).optional(),
});

const reelsSchemaExt = baseSchema.extend({
  /** Path locale del file video (Pianeta.Watchers non gestisce video) */
  video: z.string(),
  /** ID di pianeta_media_photos come copertina poster, se disponibile */
  posterPhotoId: z.string().uuid().optional(),
  client: z.string().optional(),
  durationSec: z.number().optional(),
  embeds: z.array(embedSchema).optional(),
});

// Schema per work e bulletin con embed opzionale
const workSchemaExt = baseSchema.extend({
  embeds: z.array(embedSchema).optional(),
});

const bulletinSchemaExt = baseSchema.extend({
  embeds: z.array(embedSchema).optional(),
});

const servicesSchemaExt = baseSchema.extend({
  category: z.enum(['creativity', 'design', 'technology']).optional(),
  processPhase: z.union([z.number().int().min(1).max(4), z.string()]).optional(),
  icon: z.string().optional(),
  inputClient: z.array(z.string()).optional(),
  deliverables: z.array(z.string()).optional(),
  relatedServices: z.array(z.string()).optional(),
  caseStudies: z.array(z.string()).optional(),
  order: z.number().optional(),
});

const teamSchemaExt = baseSchema.extend({
  kind: z.enum(['core', 'satellite', 'ai']).optional(),
  discipline: z.string().optional(),
});

const work = defineCollection({
  loader: glob({ pattern: '!(*.en).md', base: './src/content/work' }),
  schema: workSchemaExt,
});

const bulletin = defineCollection({
  loader: glob({ pattern: '!(*.en).md', base: './src/content/bulletin' }),
  schema: bulletinSchemaExt,
});

const posts = defineCollection({
  loader: glob({ pattern: '!(*.en).md', base: './src/content/posts' }),
  schema: postsSchemaExt,
});

const reels = defineCollection({
  loader: glob({ pattern: '!(*.en).md', base: './src/content/reels' }),
  schema: reelsSchemaExt,
});

const services = defineCollection({
  loader: glob({ pattern: '!(*.en).md', base: './src/content/services' }),
  schema: servicesSchemaExt,
});

const team = defineCollection({
  loader: glob({ pattern: '!(*.en).md', base: './src/content/team' }),
  schema: teamSchemaExt,
});

const lab = defineCollection({
  loader: glob({ pattern: '!(*.en).md', base: './src/content/lab' }),
  schema: baseSchema,
});

const careers = defineCollection({
  loader: glob({ pattern: '!(*.en).md', base: './src/content/careers' }),
  schema: baseSchema,
});

const enGenerateId = ({ entry }: { entry: string }) => entry.replace(/\.en\.md$/, '');

const workEn = defineCollection({
  loader: glob({ pattern: '*.en.md', base: './src/content/work', generateId: enGenerateId }),
  schema: workSchemaExt,
});

const bulletinEn = defineCollection({
  loader: glob({ pattern: '*.en.md', base: './src/content/bulletin', generateId: enGenerateId }),
  schema: bulletinSchemaExt,
});

const servicesEn = defineCollection({
  loader: glob({ pattern: '*.en.md', base: './src/content/services', generateId: enGenerateId }),
  schema: servicesSchemaExt,
});

const teamEn = defineCollection({
  loader: glob({ pattern: '*.en.md', base: './src/content/team', generateId: enGenerateId }),
  schema: teamSchemaExt,
});

const labEn = defineCollection({
  loader: glob({ pattern: '*.en.md', base: './src/content/lab', generateId: enGenerateId }),
  schema: baseSchema,
});

const careersEn = defineCollection({
  loader: glob({ pattern: '*.en.md', base: './src/content/careers', generateId: enGenerateId }),
  schema: baseSchema,
});

const campaigns = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/campaigns' }),
  schema: baseSchema.extend({
    channel: z.enum(['google-ads', 'meta-ads', 'linkedin-ads', 'tiktok-ads', 'organic']).optional(),
    objective: z.enum(['awareness', 'traffic', 'leads', 'conversions', 'engagement']).optional(),
    status: z.enum(['draft', 'review', 'live', 'paused', 'closed']).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    budgetTotal: z.number().optional(),
    spend: z.number().optional(),
    impressions: z.number().optional(),
    clicks: z.number().optional(),
    conversions: z.number().optional(),
    landingPage: z.string().optional(),
    audience: z.string().optional(),
    creatives: z.array(z.string()).optional(),
    googleAdsCampaignId: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const collections = {
  work,
  bulletin,
  posts,
  reels,
  services,
  team,
  lab,
  careers,
  campaigns,
  workEn,
  bulletinEn,
  servicesEn,
  teamEn,
  labEn,
  careersEn,
};
