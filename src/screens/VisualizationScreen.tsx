import { ScrollView, StyleSheet } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';
import { Lesson } from '../types/course';
import { ActivationFunctionVisualizer } from '../visualizations/ActivationFunctionVisualizer';
import { ConfusionMatrixBuilder } from '../visualizations/ConfusionMatrixBuilder';
import { NeuralNetworkFlowVisualizer } from '../visualizations/NeuralNetworkFlowVisualizer';
import { TrainingSimulator } from '../visualizations/TrainingSimulator';

export function VisualizationScreen({ lesson }: { lesson?: Lesson }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Card mode="contained" style={styles.headerCard}>
        <Card.Content style={styles.headerContent}>
          <Text variant="headlineSmall">Interactive visualization lab</Text>
          <Text variant="bodyLarge">Experiment with neural network flow, activation functions, optimization curves, and classification metrics.</Text>
          {lesson ? <Chip>Recommended for: {lesson.title}</Chip> : null}
        </Card.Content>
      </Card>
      <NeuralNetworkFlowVisualizer />
      <ActivationFunctionVisualizer />
      <TrainingSimulator />
      <ConfusionMatrixBuilder />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
  headerCard: {
    backgroundColor: '#E6F4EA',
  },
  headerContent: {
    gap: 12,
  },
});
