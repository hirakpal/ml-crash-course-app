import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Divider, Text } from 'react-native-paper';
import { Lesson } from '../types/course';

export function LessonScreen({ lesson, completed, onComplete, onOpenQuiz, onOpenVisualizations }: { lesson: Lesson; completed: boolean; onComplete: () => void; onOpenQuiz: () => void; onOpenVisualizations: () => void; }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Card mode="contained" style={styles.headerCard}>
        <Card.Content style={styles.headerContent}>
          <Chip>{lesson.moduleTitle}</Chip>
          <Text variant="headlineSmall">{lesson.title}</Text>
          <Text variant="bodyLarge">{lesson.summary}</Text>
          <Text variant="bodySmall">Estimated time: {lesson.durationMinutes} minutes</Text>
          <View style={styles.actions}>
            <Button mode={completed ? 'outlined' : 'contained'} onPress={onComplete}>
              {completed ? 'Completed' : 'Mark as complete'}
            </Button>
            <Button mode="outlined" onPress={onOpenQuiz}>Take quiz</Button>
            <Button mode="text" onPress={onOpenVisualizations}>Visual lab</Button>
          </View>
        </Card.Content>
      </Card>

      {lesson.sections.map((section) => (
        <Card key={section.heading} mode="outlined">
          <Card.Content style={styles.sectionContent}>
            <Text variant="titleMedium">{section.heading}</Text>
            <Text variant="bodyMedium">{section.body}</Text>
            {section.bullets?.map((bullet) => (
              <Text key={bullet} variant="bodyMedium">• {bullet}</Text>
            ))}
            {section.codeExample ? (
              <View style={styles.codeBlock}>
                <Text variant="bodySmall">{section.codeExample}</Text>
              </View>
            ) : null}
          </Card.Content>
        </Card>
      ))}

      <Card mode="outlined">
        <Card.Content style={styles.sectionContent}>
          <Text variant="titleMedium">Resources</Text>
          <Divider />
          {lesson.resources.map((resource) => (
            <View key={resource.url} style={styles.resourceRow}>
              <Text variant="bodyMedium">{resource.title}</Text>
              <Chip compact>{resource.type}</Chip>
            </View>
          ))}
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
    backgroundColor: '#E8F0FE',
  },
  headerContent: {
    gap: 12,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionContent: {
    gap: 10,
  },
  codeBlock: {
    backgroundColor: '#101828',
    borderRadius: 12,
    padding: 12,
  },
  resourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    alignItems: 'center',
  },
});
