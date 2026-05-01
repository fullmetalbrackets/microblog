import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import yeskunallumami from '@yeskunall/astro-umami';
import rehypeExternalLinks from 'rehype-external-links';
import { defineConfig, fontProviders } from 'astro/config';
import astroCompress from 'gab-astro-compress';

export default defineConfig({
	site: 'https://ariel.lol',
	prefetch: true,
	build: {
		inlineStylesheets: 'always',
	},
	integrations: [
		mdx(),
		sitemap(),
		astroCompress(),
		yeskunallumami({
			id: '5267ef5d-2c51-421e-bdc1-fd53fe5de091',
			hostUrl: 'https://u.adiaz.fyi',
		}),
	],
	markdown: {
		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					target: '_blank',
					rel: ['noopener', 'noreferrer'],
				},
			],
		],
	},
	redirect: {
		'/blog/': {
			status: 302,
			destination: '/',
		},
		'/posts/': {
			status: 302,
			destination: '/',
		},
	},
	fonts: [
		{
			name: 'Bricolage Grotesque',
			cssVariable: '--bricolage',
			provider: fontProviders.fontsource(),
			weights: [200, 300, 400, 500, 600, 700, 800],
			styles: ['normal', 'italic'],
			subsets: ['latin'],
		},
		// {
		// 	name: 'Figtree',
		// 	cssVariable: '--figtree',
		// 	provider: fontProviders.fontsource(),
		// 	weights: [300, 400, 500, 600, 700, 800, 900],
		// 	styles: ['normal', 'italic'],
		// 	subsets: ['latin'],
		// },
		{
			name: 'Courier Prime',
			cssVariable: '--courier',
			provider: fontProviders.fontsource(),
			weights: [400, 700],
			styles: ['normal', 'italic'],
			subsets: ['latin'],
		},
	],
});
