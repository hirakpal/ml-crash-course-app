import { StyleSheet, View } from 'react-native';
import { Appbar, BottomNavigation } from 'react-native-paper';
import { useAppContext } from '../redux/AppContext';
import { HomeScreen } from './HomeScreen';
import { LessonScreen } from './LessonScreen';
import { QuizScreen } from './QuizScreen';
import { VisualizationScreen } from './VisualizationScreen';

export function AppShell() {
  const { route, goHome, selectedLesson, progress, openLesson, openQuiz, openVisualizations, markLessonComplete, saveQuizScore } = useAppContext();

  const renderContent = () => {
    if (route.name === 'lesson' && selectedLesson) {
      return (
        <LessonScreen
          lesson={selectedLesson}
          completed={progress[selectedLesson.id]?.completed ?? false}
          onComplete={() => void markLessonComplete(selectedLesson.id)}
          onOpenQuiz={() => openQuiz(selectedLesson.id)}
          onOpenVisualizations={() => openVisualizations(selectedLesson.id)}
        />
      );
    }

    if (route.name === 'quiz' && selectedLesson) {
      return (
        <QuizScreen
          lesson={selectedLesson}
          bestScore={progress[selectedLesson.id]?.bestScore ?? 0}
          onSaveScore={(score) => saveQuizScore(selectedLesson.id, score)}
          onBackToLesson={() => openLesson(selectedLesson.id)}
        />
      );
    }

    if (route.name === 'visualizations') {
      return <VisualizationScreen lesson={selectedLesson} />;
    }

    return <HomeScreen />;
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        {route.name !== 'home' ? <Appbar.BackAction onPress={goHome} /> : null}
        <Appbar.Content title="ML Crash Course App" subtitle={selectedLesson?.title ?? 'Offline-first learning'} />
      </Appbar.Header>
      <View style={styles.content}>{renderContent()}</View>
      <BottomNavigation.Bar
        navigationState={{
          index:
            route.name === 'home'
              ? 0
              : route.name === 'lesson'
                ? 1
                : route.name === 'quiz'
                  ? 2
                  : 3,
          routes: [
            { key: 'home', title: 'Home', focusedIcon: 'home' },
            { key: 'lesson', title: 'Lesson', focusedIcon: 'book-open-page-variant' },
            { key: 'quiz', title: 'Quiz', focusedIcon: 'help-circle' },
            { key: 'visualizations', title: 'Visuals', focusedIcon: 'chart-bubble' },
          ],
        }}
        onTabPress={({ route: pressedRoute }) => {
          if (pressedRoute.key === 'home') {
            goHome();
          } else if (pressedRoute.key === 'lesson') {
            if (selectedLesson) {
              openLesson(selectedLesson.id);
            }
          } else if (pressedRoute.key === 'quiz') {
            if (selectedLesson) {
              openQuiz(selectedLesson.id);
            }
          } else if (pressedRoute.key === 'visualizations') {
            openVisualizations(selectedLesson?.id);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  content: {
    flex: 1,
  },
});
