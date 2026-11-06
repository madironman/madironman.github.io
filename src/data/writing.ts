import { getCollection } from 'astro:content';

// Published notes, newest first. Drafts stay out of the build.
export async function getNotes() {
  const notes = await getCollection('writing', ({ data }) => !data.draft);
  return notes.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

// Fixed three-letter months, matching the rest of the page; avoids ICU
// differences between Node versions ("Sep" vs "Sept").
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const fmtDate = (d: Date) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

// Markdown bodies get curly apostrophes from the renderer; frontmatter titles and
// summaries do not. Curl them at display time so headings match the body text.
export const smart = (s: string) => s.replace(/(\w)'(\w)/g, '$1’$2');
