import { defineCollection, z } from 'astro:content';

const work = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    client: z.string().optional(),
    category: z.string().optional(),
    year: z.number().optional(),
    date: z.date().optional(),
    updated: z.date().optional(),
    sector: z.string().optional(),
    cover: z.string().optional(),
    ogImage: z.string().optional(),
    hero: z
      .object({
        type: z.string(),
        src: z.string(),
      })
      .optional(),
    services: z.array(z.string()).optional(),
    team: z.array(z.string()).optional(),
    links: z
      .object({
        live: z.string().optional(),
        bulletin: z.array(z.string()).optional(),
      })
      .optional(),
    locale: z.string().optional(),
    draft: z.boolean().optional(),
    type: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { work };
