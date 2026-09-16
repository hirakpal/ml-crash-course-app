import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, RadioButton, Text } from 'react-native-paper';
import { Lesson } from '../types/course';

export function QuizScreen({ lesson, bestScore, onSaveScore, onBackToLesson }: { lesson: Lesson; bestScore: number; onSaveScore: (score: number) => Promise<void>; onBackToLesson: () => void; }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const isComplete = useMemo(() => lesson.quiz.every((question) => answers[question.id] !== undefined), [answers, lesson.quiz]);

  const submit = async () => {
    const nextScore = lesson.quiz.reduce((total, question) => total + (answers[question.id] === question.answerIndex ? 1 : 0), 0);
    setScore(nextScore);
    setSubmitted(true);
    await onSaveScore(nextScore);
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Card mode="contained" style={styles.headerCard}>
        <Card.Content style={styles.headerContent}>
          <Text variant="headlineSmall">{lesson.title} quiz</Text>
          <Text variant="bodyMedium">Best score so far: {bestScore}/{lesson.quiz.length}</Text>
        </Card.Content>
      </Card>

      {lesson.quiz.map((question, index) => (
        <Card key={question.id} mode="outlined">
          <Card.Content style={styles.questionContent}>
            <Text variant="titleMedium">Question {index + 1}</Text>
            <Text variant="bodyLarge">{question.prompt}</Text>
            <RadioButton.Group
              onValueChange={(value) => setAnswers((current) => ({ ...current, [question.id]: Number(value) }))}
              value={answers[question.id]?.toString() ?? ''}
            >
              {question.options.map((option, optionIndex) => (
                <View key={`${question.id}-${optionIndex}`} style={styles.optionRow}>
                  <RadioButton value={optionIndex.toString()} />
                  <Text style={styles.optionLabel}>{option}</Text>
                </View>
              ))}
            </RadioButton.Group>
            {submitted ? (
              <Text variant="bodySmall" style={answers[question.id] === question.answerIndex ? styles.correct : styles.incorrect}>
                {question.explanation}
              </Text>
            ) : null}
          </Card.Content>
        </Card>
      ))}

      <Card mode="outlined">
        <Card.Content style={styles.headerContent}>
          <Button mode="contained" disabled={!isComplete} onPress={submit}>Submit quiz</Button>
          {submitted ? (
            <>
              <Text variant="headlineSmall">Score: {score}/{lesson.quiz.length}</Text>
              <Button mode="outlined" onPress={onBackToLesson}>Back to lesson</Button>
            </>
          ) : null}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
  headerCard: {
    backgroundColor: '#EDE7F6',
  },
  headerContent: {
    gap: 12,
  },
  questionContent: {
    gap: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    flex: 1,
  },
  correct: {
    color: '#146C2E',
  },
  incorrect: {
    color: '#B3261E',
  },
});
