import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			pubDate: z.coerce.date(),
			image: image().optional(),
			alt: z.string().optional(),
		}),
});

export const collections = { blog };
