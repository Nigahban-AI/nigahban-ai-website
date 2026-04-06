import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    category: z.enum(['product', 'industry', 'safety', 'engineering', 'company']),
    locale: z.enum(['en', 'ur']).default('en'),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Nigahban AI'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
