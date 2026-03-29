import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { marked } from 'marked';
import { SITE_DESCRIPTION, SITE_TITLE } from '@consts';

export async function GET(context) {
	const posts = await getCollection('blog');

	const sorted = posts.sort(
		(a, b) =>
			new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf()
	);

	const items = await Promise.all(
		sorted.map(async (post) => {
			const cleanBody = (post.body ?? '')
				// remove import statements
				.replace(/^import\s+.*$/gm, '')
				// extract YouTube ID from inside span wrapper and convert to link BEFORE span is stripped
				.replace(
					/<span[^>]*class=['"]yt['"][^>]*>\s*<YouTube\s+id=['"](?:https?:\/\/(?:www\.)?youtube\.com\/watch\?v=|https?:\/\/youtu\.be\/)?([a-zA-Z0-9_-]+)['"]\s*\/>\s*<\/span>/g,
					'\n[Watch on YouTube](https://www.youtube.com/watch?v=$1)\n'
				)
				// convert any remaining YouTube components not in a span
				.replace(
					/<YouTube\s+id=['"](?:https?:\/\/(?:www\.)?youtube\.com\/watch\?v=|https?:\/\/youtu\.be\/)?([a-zA-Z0-9_-]+)['"]\s*\/>/g,
					'[Watch on YouTube](https://www.youtube.com/watch?v=$1)'
				)
				// remove any remaining unknown JSX components
				.replace(/<[A-Z][^>]*\/?>/g, '')
				.replace(/<\/[A-Z][^>]*>/g, '')
				.trim();

			const html = await marked.parse(cleanBody);

			const dateTitle = new Date(post.data.pubDate).toLocaleDateString(
				'en-US',
				{
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				}
			);

			const imageUrl =
				post.data.image ?
					typeof post.data.image === 'string' ?
						new URL(post.data.image, context.site).toString()
					:	new URL(post.data.image.src, context.site).toString()
				:	null;

			const imageHtml =
				imageUrl ?
					`<img src="${imageUrl}" alt="${post.data.alt ?? ''}" />\n`
				:	'';

			return {
				title: dateTitle,
				description: SITE_DESCRIPTION,
				content: imageHtml + html,
				link: `/blog/${post.id}/`,
				pubDate: new Date(post.data.pubDate),
				...(imageUrl && {
					enclosure: {
						url: imageUrl,
						type: `image/${imageUrl.split('.').pop()?.replace('jpg', 'jpeg') ?? 'jpeg'}`,
						length: 0,
					},
				}),
			};
		})
	);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items,
	});
}
