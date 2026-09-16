import { REMOTE_COURSE_URL } from '../data/curriculum';
import { RemoteCourseOutline } from '../types/course';
import { saveRemoteOutline } from './storage';

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function parseRemoteCourseHtml(html: string): RemoteCourseOutline {
  const headingMatches = [...html.matchAll(/<h[23][^>]*>(.*?)<\/h[23]>/gi)];
  const headings = Array.from(
    new Set(
      headingMatches
        .map((match) => stripHtml(match[1]))
        .filter(Boolean)
        .slice(0, 12)
    )
  );

  const paragraphMatch = html.match(/<p[^>]*>(.*?)<\/p>/i);
  const snippet = paragraphMatch ? stripHtml(paragraphMatch[1]).slice(0, 280) : 'Remote course content fetched successfully.';

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
