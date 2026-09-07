import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '../data/site';

export async function GET(context: APIContext) {
  const posts = (await getCollection('writing', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: `${site.fullName} · Writing`,
    description: 'Notes on mechanisms firmware engineers keep meeting: how things work, why they fail, and what the fix pattern looks like.',
    site: context.site ?? site.url,
    trailingSlash: false,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.summary,
      pubDate: p.data.date,
      link: `/writing/${p.id}`,
      categories: p.data.tags,
      author: site.email,
    })),
    customData: `<language>en-gb</language><managingEditor>${site.email} (${site.fullName})</managingEditor>`,
  });
}
