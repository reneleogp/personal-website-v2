import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site?: URL }) {
  const posts = (await getCollection('writing', ({ data }) => !data.draft)).sort(
    (first, second) => second.data.date.valueOf() - first.data.date.valueOf(),
  );

  return rss({
    title: 'Rene Gonzalez - Notebook',
    description: 'Technical notes and things worth remembering.',
    site: context.site ?? new URL('https://reneleo.com'),
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `${post.data.slug}/`,
    })),
  });
}