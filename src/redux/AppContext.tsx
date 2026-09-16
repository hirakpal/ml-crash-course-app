import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Lesson, LessonProgress, AppRoute, RemoteCourseOutline } from '../types/course';
import { syncRemoteCourseOutline } from '../utils/contentSync';
import { getLessons, getProgress, getRemoteOutline, initializeStorage, saveLessonProgress } from '../utils/storage';

type AppContextValue = {
  isReady: boolean;
  route: AppRoute;
  lessons: Lesson[];
  progress: Record<string, LessonProgress>;
  remoteOutline: RemoteCourseOutline | null;
  selectedLesson?: Lesson;
  syncError?: string;
  isSyncing: boolean;
  goHome: () => void;
  openLesson: (lessonId: string) => void;
  openQuiz: (lessonId: string) => void;
  openVisualizations: (lessonId?: string) => void;
  markLessonComplete: (lessonId: string) => Promise<void>;
  saveQuizScore: (lessonId: string, score: number) => Promise<void>;
  refreshRemoteOutline: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [route, setRoute] = useState<AppRoute>({ name: 'home' });
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({});
  const [remoteOutline, setRemoteOutline] = useState<RemoteCourseOutline | null>(null);
  const [syncError, setSyncError] = useState<string>();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const load = async () => {
      await initializeStorage();
      const [loadedLessons, loadedProgress, outline] = await Promise.all([getLessons(), getProgress(), getRemoteOutline()]);
      setLessons(loadedLessons);
      setProgress(loadedProgress);
      setRemoteOutline(outline);
      setIsReady(true);
    };

    load().catch((error: Error) => {
      setSyncError(error.message);
      setIsReady(true);
    });
  }, []);

  const selectedLesson = useMemo(() => {
    const lessonId = route.name === 'home' ? undefined : route.lessonId;
    return lessonId ? lessons.find((lesson) => lesson.id === lessonId) : undefined;
  }, [lessons, route]);

  const refreshState = async () => {
    const [loadedLessons, loadedProgress, outline] = await Promise.all([getLessons(), getProgress(), getRemoteOutline()]);
    setLessons(loadedLessons);
    setProgress(loadedProgress);
    setRemoteOutline(outline);
  };

  const markLessonComplete = async (lessonId: string) => {
    await saveLessonProgress(lessonId, { completed: true, completedAt: new Date().toISOString() });
    await refreshState();
  };

  const saveQuizScore = async (lessonId: string, score: number) => {
    const current = progress[lessonId];
    await saveLessonProgress(lessonId, {
      bestScore: Math.max(score, current?.bestScore ?? 0),
      completed: current?.completed ?? false,
      completedAt: current?.completedAt,
    });
    await refreshState();
  };

  const refreshRemoteOutline = async () => {
    setIsSyncing(true);
    setSyncError(undefined);
    try {
      const outline = await syncRemoteCourseOutline();
      setRemoteOutline(outline);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Unable to sync remote content.');
    } finally {
      setIsSyncing(false);
    }
  };

  const value: AppContextValue = {
    isReady,
    route,
    lessons,
    progress,
    remoteOutline,
    selectedLesson,
    syncError,
    isSyncing,
    goHome: () => setRoute({ name: 'home' }),
    openLesson: (lessonId) => setRoute({ name: 'lesson', lessonId }),
    openQuiz: (lessonId) => setRoute({ name: 'quiz', lessonId }),
    openVisualizations: (lessonId) => setRoute(lessonId ? { name: 'visualizations', lessonId } : { name: 'visualizations' }),
    markLessonComplete,
    saveQuizScore,
    refreshRemoteOutline,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return context;
}
