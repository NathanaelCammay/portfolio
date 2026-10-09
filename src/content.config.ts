import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Each Markdown file in src/content/projects becomes a project page.
// The file name is the URL: portfolio-site.md -> /projects/portfolio-site
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    stack: z.array(z.string()),
    date: z.coerce.date(),
    repo: z.url().optional(),
    live: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
