import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { LessonCard } from '../components/LessonCard';
import { ProgressSummary } from '../components/ProgressSummary';
import { useAppContext } from '../redux/AppContext';
import { getOverallProgress, isLessonUnlocked } from '../utils/lessonSelectors';

export function HomeScreen() {
  const { lessons, progress, remoteOutline, openLesson, openQuiz, openVisualizations, refreshRemoteOutline, isSyncing, syncError } = useAppContext();
  const completedLessons = lessons.filter((lesson) => progress[lesson.id]?.completed).length;
  const percent = getOverallProgress(lessons, progress);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Card mode="contained" style={styles.heroCard}>
        <Card.Content style={styles.heroContent}>
          <Text variant="headlineSmall">Google ML Crash Course, optimized for mobile</Text>
          <Text variant="bodyLarge">
            Study offline, move through structured lessons in order, and use visual simulations to make neural networks and optimization intuitive.
          </Text>
          <View style={styles.heroButtons}>
            <Button mode="contained" onPress={() => openLesson(lessons[0]?.id ?? '')} disabled={!lessons[0]}>Start course</Button>
            <Button mode="outlined" onPress={() => openVisualizations()}>Open visual lab</Button>
          </View>
        </Card.Content>
      </Card>

      <ProgressSummary completedLessons={completedLessons} totalLessons={lessons.length} percent={percent} />

      <Card mode="outlined">
        <Card.Content style={styles.syncContent}>
          <Text variant="titleMedium">Content sync</Text>
          <Text variant="bodyMedium">
            The app seeds lessons locally for offline use and can refresh the public Google course outline when network access is available.
          </Text>
          <Text variant="bodySmall">Source: {remoteOutline?.sourceUrl ?? 'Not available yet'}</Text>
          <Text variant="bodySmall">Last sync: {remoteOutline ? new Date(remoteOutline.syncedAt).toLocaleString() : 'Never'}</Text>
          <Text variant="bodySmall">Remote headings found: {remoteOutline?.headings.length ?? 0}</Text>
          {remoteOutline?.snippet ? <Text variant="bodySmall">{remoteOutline.snippet}</Text> : null}
          {syncError ? <Text variant="bodySmall" style={styles.error}>{syncError}</Text> : null}
          <Button mode="outlined" loading={isSyncing} onPress={refreshRemoteOutline}>Sync remote outline</Button>
        </Card.Content>
      </Card>

      <View style={styles.lessonList}>
        {lessons.map((lesson) => {
          const locked = !isLessonUnlocked(lesson, progress) && lesson.prerequisiteLessonIds.length > 0;
          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              progress={progress[lesson.id]}
              locked={locked}
              onOpenLesson={() => openLesson(lesson.id)}
              onOpenQuiz={() => openQuiz(lesson.id)}
              onOpenVisualizations={() => openVisualizations(lesson.id)}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
  heroCard: {
    backgroundColor: '#1A73E8',
  },
  heroContent: {
    gap: 12,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  syncContent: {
    gap: 8,
  },
  lessonList: {
    gap: 16,
  },
  error: {
    color: '#B3261E',
  },
});
