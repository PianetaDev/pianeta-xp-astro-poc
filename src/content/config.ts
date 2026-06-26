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

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: baseSchema,
});

const bulletin = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/bulletin' }),
  schema: baseSchema,
});

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: baseSchema,
});

const team = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/team' }),
  schema: baseSchema,
});

const lab = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/lab' }),
  schema: baseSchema,
});

const careers = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/careers' }),
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

export const collections = { work, bulletin, services, team, lab, careers, campaigns };
