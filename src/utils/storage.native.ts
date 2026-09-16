import * as SQLite from 'expo-sqlite';
import { CURRICULUM_SEED, REMOTE_COURSE_URL } from '../data/curriculum';
import { Lesson, LessonProgress, RemoteCourseOutline } from '../types/course';

const databasePromise = SQLite.openDatabaseAsync('ml-crash-course.db');

async function getDb() {
  return databasePromise;
}

export async function initializeStorage() {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY NOT NULL,
      module_id TEXT NOT NULL,
      module_title TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      order_index INTEGER NOT NULL,
      prerequisite_lesson_ids TEXT NOT NULL,
      visualization_ids TEXT NOT NULL,
      sections_json TEXT NOT NULL,
      quiz_json TEXT NOT NULL,
      resources_json TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS lesson_progress (
      lesson_id TEXT PRIMARY KEY NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      best_score INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT
    );
    CREATE TABLE IF NOT EXISTS remote_course_outline (
      source_url TEXT PRIMARY KEY NOT NULL,
      headings_json TEXT NOT NULL,
      snippet TEXT NOT NULL,
      synced_at TEXT NOT NULL
    );
  `);

  const row = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM lessons');
  if ((row?.count ?? 0) === 0) {
    for (const lesson of CURRICULUM_SEED) {
      await db.runAsync(
        `INSERT INTO lessons (
          id, module_id, module_title, title, summary, duration_minutes, order_index,
          prerequisite_lesson_ids, visualization_ids, sections_json, quiz_json, resources_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          lesson.id,
          lesson.moduleId,
          lesson.moduleTitle,
          lesson.title,
          lesson.summary,
          lesson.durationMinutes,
          lesson.orderIndex,
          JSON.stringify(lesson.prerequisiteLessonIds),
          JSON.stringify(lesson.visualizationIds),
          JSON.stringify(lesson.sections),
          JSON.stringify(lesson.quiz),
          JSON.stringify(lesson.resources),
        ]
      );
      await db.runAsync(
        'INSERT OR IGNORE INTO lesson_progress (lesson_id, completed, best_score, completed_at) VALUES (?, 0, 0, NULL)',
        [lesson.id]
      );
    }

    await db.runAsync(
      'INSERT OR IGNORE INTO remote_course_outline (source_url, headings_json, snippet, synced_at) VALUES (?, ?, ?, ?)',
      [REMOTE_COURSE_URL, JSON.stringify([]), 'Offline curriculum ready. Pull remote headings when network access is available.', new Date(0).toISOString()]
    );
  }
}

type LessonRow = {
  id: string;
  module_id: string;
  module_title: string;
  title: string;
  summary: string;
  duration_minutes: number;
  order_index: number;
  prerequisite_lesson_ids: string;
  visualization_ids: string;
  sections_json: string;
  quiz_json: string;
  resources_json: string;
};

export async function getLessons(): Promise<Lesson[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<LessonRow>('SELECT * FROM lessons ORDER BY order_index ASC');
  return rows.map((row) => ({
    id: row.id,
    moduleId: row.module_id,
    moduleTitle: row.module_title,
    title: row.title,
    summary: row.summary,
    durationMinutes: row.duration_minutes,
    orderIndex: row.order_index,
    prerequisiteLessonIds: JSON.parse(row.prerequisite_lesson_ids),
    visualizationIds: JSON.parse(row.visualization_ids),
    sections: JSON.parse(row.sections_json),
    quiz: JSON.parse(row.quiz_json),
    resources: JSON.parse(row.resources_json),
  }));
}

type ProgressRow = {
  lesson_id: string;
  completed: number;
  best_score: number;
  completed_at: string | null;
};

export async function getProgress(): Promise<Record<string, LessonProgress>> {
  const db = await getDb();
  const rows = await db.getAllAsync<ProgressRow>('SELECT * FROM lesson_progress');
  return rows.reduce<Record<string, LessonProgress>>((acc, row) => {
    acc[row.lesson_id] = {
      lessonId: row.lesson_id,
      completed: row.completed === 1,
      bestScore: row.best_score,
      completedAt: row.completed_at ?? undefined,
    };
    return acc;
  }, {});
}

export async function saveLessonProgress(lessonId: string, updates: Partial<LessonProgress>) {
  const db = await getDb();
  const current = await db.getFirstAsync<ProgressRow>('SELECT * FROM lesson_progress WHERE lesson_id = ?', [lessonId]);
  const completed = updates.completed ?? (current?.completed === 1);
  const bestScore = Math.max(updates.bestScore ?? 0, current?.best_score ?? 0);
  const completedAt = completed ? updates.completedAt ?? current?.completed_at ?? new Date().toISOString() : null;
  await db.runAsync(
    `INSERT INTO lesson_progress (lesson_id, completed, best_score, completed_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(lesson_id) DO UPDATE SET completed = excluded.completed, best_score = excluded.best_score, completed_at = excluded.completed_at`,
    [lessonId, completed ? 1 : 0, bestScore, completedAt]
  );
}

export async function getRemoteOutline(): Promise<RemoteCourseOutline | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ source_url: string; headings_json: string; snippet: string; synced_at: string }>(
    'SELECT * FROM remote_course_outline WHERE source_url = ?',
    [REMOTE_COURSE_URL]
  );
  if (!row) {
    return null;
  }

  return {
    sourceUrl: row.source_url,
    headings: JSON.parse(row.headings_json),
    snippet: row.snippet,
    syncedAt: row.synced_at,
  };
}

export async function saveRemoteOutline(outline: RemoteCourseOutline) {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO remote_course_outline (source_url, headings_json, snippet, synced_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(source_url) DO UPDATE SET headings_json = excluded.headings_json, snippet = excluded.snippet, synced_at = excluded.synced_at`,
    [outline.sourceUrl, JSON.stringify(outline.headings), outline.snippet, outline.syncedAt]
  );
}
