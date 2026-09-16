export type LessonSection = {
  heading: string;
  body: string;
  bullets?: string[];
  codeExample?: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type ResourceLink = {
  title: string;
  url: string;
  type: 'reading' | 'video' | 'lab';
};

export type Lesson = {
  id: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  summary: string;
  durationMinutes: number;
  orderIndex: number;
  prerequisiteLessonIds: string[];
  visualizationIds: string[];
  sections: LessonSection[];
  quiz: QuizQuestion[];
  resources: ResourceLink[];
};

export type LessonProgress = {
  lessonId: string;
  completed: boolean;
  bestScore: number;
  completedAt?: string;
};

export type RemoteCourseOutline = {
  sourceUrl: string;
  headings: string[];
  snippet: string;
  syncedAt: string;
};

export type AppRoute =
  | { name: 'home' }
  | { name: 'lesson'; lessonId: string }
  | { name: 'quiz'; lessonId: string }
  | { name: 'visualizations'; lessonId?: string };
