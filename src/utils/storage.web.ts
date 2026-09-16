import { CURRICULUM_SEED, REMOTE_COURSE_URL } from '../data/curriculum';
import { Lesson, LessonProgress, RemoteCourseOutline } from '../types/course';

const LESSONS_KEY = 'mlcc-lessons';
const PROGRESS_KEY = 'mlcc-progress';
const OUTLINE_KEY = 'mlcc-outline';

const defaultOutline: RemoteCourseOutline = {
  sourceUrl: REMOTE_COURSE_URL,
  headings: [],
  snippet: 'Offline curriculum ready. Pull remote headings when network access is available.',
  syncedAt: new Date(0).toISOString(),
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof localStorage === 'undefined') {
    return fallback;
  }

  const value = localStorage.getItem(key);
  return value ? (JSON.parse(value) as T) : fallback;
}

function writeJson<T>(key: string, value: T) {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}

export async function initializeStorage() {
  const lessons = readJson<Lesson[]>(LESSONS_KEY, []);
  if (lessons.length === 0) {
    writeJson(LESSONS_KEY, CURRICULUM_SEED);
  }

  const progress = readJson<Record<string, LessonProgress>>(PROGRESS_KEY, {});
  if (Object.keys(progress).length === 0) {
    const seeded = CURRICULUM_SEED.reduce<Record<string, LessonProgress>>((accumulator, lesson) => {
      accumulator[lesson.id] = { lessonId: lesson.id, completed: false, bestScore: 0 };
      return accumulator;
    }, {});
    writeJson(PROGRESS_KEY, seeded);
  }

  if (!readJson<RemoteCourseOutline | null>(OUTLINE_KEY, null)) {
    writeJson(OUTLINE_KEY, defaultOutline);
  }
}

export async function getLessons(): Promise<Lesson[]> {
  return readJson<Lesson[]>(LESSONS_KEY, CURRICULUM_SEED).sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function getProgress(): Promise<Record<string, LessonProgress>> {
  return readJson<Record<string, LessonProgress>>(PROGRESS_KEY, {});
}

export async function saveLessonProgress(lessonId: string, updates: Partial<LessonProgress>) {
  const progress = await getProgress();
  const current = progress[lessonId] ?? { lessonId, completed: false, bestScore: 0 };
  progress[lessonId] = {
    lessonId,
    completed: updates.completed ?? current.completed,
    bestScore: Math.max(updates.bestScore ?? 0, current.bestScore),
    completedAt: updates.completed ? updates.completedAt ?? current.completedAt ?? new Date().toISOString() : current.completedAt,
  };
  writeJson(PROGRESS_KEY, progress);
}

export async function getRemoteOutline(): Promise<RemoteCourseOutline | null> {
  return readJson<RemoteCourseOutline>(OUTLINE_KEY, defaultOutline);
}

export async function saveRemoteOutline(outline: RemoteCourseOutline) {
  writeJson(OUTLINE_KEY, outline);
}
