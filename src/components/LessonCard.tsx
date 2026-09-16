import { StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text } from 'react-native-paper';
import { Lesson, LessonProgress } from '../types/course';

export function LessonCard({ lesson, progress, locked, onOpenLesson, onOpenQuiz, onOpenVisualizations }: { lesson: Lesson; progress?: LessonProgress; locked: boolean; onOpenLesson: () => void; onOpenQuiz: () => void; onOpenVisualizations: () => void; }) {
  return (
    <Card mode="outlined" style={locked ? styles.lockedCard : undefined}>
      <Card.Content style={styles.content}>
        <View style={styles.row}>
          <Chip compact>{lesson.moduleTitle}</Chip>
          {progress?.completed ? <Chip compact icon="check">Complete</Chip> : null}
        </View>
        <Text variant="titleLarge">{lesson.title}</Text>
        <Text variant="bodyMedium">{lesson.summary}</Text>
        <View style={styles.row}>
          <Text variant="bodySmall">{lesson.durationMinutes} min</Text>
          <Text variant="bodySmall">Best quiz: {progress?.bestScore ?? 0}/{lesson.quiz.length}</Text>
        </View>
        <View style={styles.actions}>
          <Button mode="contained" disabled={locked} onPress={onOpenLesson}>Open lesson</Button>
          <Button mode="outlined" disabled={locked} onPress={onOpenQuiz}>Quiz</Button>
          <Button mode="text" onPress={onOpenVisualizations}>Visuals</Button>
        </View>
        {locked ? <Text variant="bodySmall">Finish prerequisite lessons to unlock this step.</Text> : null}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  lockedCard: {
    opacity: 0.8,
  },
});
