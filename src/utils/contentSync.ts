import { REMOTE_COURSE_URL } from '../data/curriculum';
import { RemoteCourseOutline } from '../types/course';
import { saveRemoteOutline } from './storage';

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseWithDom(html: string) {
  if (typeof DOMParser === 'undefined') {
    return null;
  }

  const document = new DOMParser().parseFromString(html, 'text/html');
  const headings = Array.from(document.querySelectorAll('h2, h3'))
    .map((element) => stripHtml(element.textContent ?? ''))
    .filter(Boolean)
    .slice(0, 12);
  const snippet = stripHtml(document.querySelector('p')?.textContent ?? '').slice(0, 280);

  return {
    headings: Array.from(new Set(headings)),
    snippet: snippet || 'Remote course content fetched successfully.',
  };
}

export function parseRemoteCourseHtml(html: string): RemoteCourseOutline {
  const domResult = parseWithDom(html);
  const headingMatches = [...html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)];
  const headings = domResult?.headings ?? Array.from(
    new Set(
      headingMatches
        .map((match) => stripHtml(match[1]))
        .filter(Boolean)
        .slice(0, 12)
    )
  );

  const paragraphMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  const snippet = domResult?.snippet ?? (paragraphMatch ? stripHtml(paragraphMatch[1]).slice(0, 280) : 'Remote course content fetched successfully.');

  return {
    sourceUrl: REMOTE_COURSE_URL,
    headings,
    snippet,
    syncedAt: new Date().toISOString(),
  };
}

export async function syncRemoteCourseOutline() {
  const response = await fetch(REMOTE_COURSE_URL, {
    headers: {
      Accept: 'text/html,application/xhtml+xml',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch remote course content: ${response.status}`);
  }

  const html = await response.text();
  const outline = parseRemoteCourseHtml(html);
  await saveRemoteOutline(outline);
  return outline;
}
