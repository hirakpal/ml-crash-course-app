import { StyleSheet, View } from 'react-native';
import { Card, ProgressBar, Text } from 'react-native-paper';

export function ProgressSummary({ completedLessons, totalLessons, percent }: { completedLessons: number; totalLessons: number; percent: number; }) {
  return (
    <Card mode="contained" style={styles.card}>
      <Card.Content style={styles.content}>
        <Text variant="titleMedium">Course progress</Text>
        <Text variant="bodyMedium">{completedLessons} of {totalLessons} lessons completed</Text>
        <ProgressBar progress={percent / 100} style={styles.progressBar} />
        <Text variant="headlineSmall">{percent}%</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E8F0FE',
  },
  content: {
    gap: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 999,
  },
});
