import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			pubDate: z.coerce.date(),
			image: z.union([z.string(), image()]).optional(),
			alt: z.string().optional(),
		}),
});

export const collections = { blog };
