import { Lesson, LessonProgress } from '../types/course';

export function isLessonUnlocked(lesson: Lesson, progress: Record<string, LessonProgress>) {
  return lesson.prerequisiteLessonIds.every((lessonId) => progress[lessonId]?.completed);
}

export function getOverallProgress(lessons: Lesson[], progress: Record<string, LessonProgress>) {
  if (lessons.length === 0) {
    return 0;
  }

  const completedCount = lessons.filter((lesson) => progress[lesson.id]?.completed).length;
  return Math.round((completedCount / lessons.length) * 100);
}
