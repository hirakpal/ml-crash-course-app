import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { StepControl } from '../components/StepControl';

function safeDivide(value: number, total: number) {
  return total === 0 ? 0 : value / total;
}

export function ConfusionMatrixBuilder() {
  const [tp, setTp] = useState(18);
  const [fp, setFp] = useState(5);
  const [fn, setFn] = useState(4);
  const [tn, setTn] = useState(22);

  const metrics = useMemo(() => ({
    accuracy: safeDivide(tp + tn, tp + tn + fp + fn),
    precision: safeDivide(tp, tp + fp),
    recall: safeDivide(tp, tp + fn),
  }), [fn, fp, tn, tp]);

  return (
    <Card mode="outlined">
      <Card.Content style={styles.content}>
        <Text variant="titleMedium">Interactive confusion matrix</Text>
        <View style={styles.matrix}>
          <View style={styles.cell}><Text variant="bodySmall">TP</Text><Text variant="headlineSmall">{tp}</Text></View>
          <View style={styles.cell}><Text variant="bodySmall">FP</Text><Text variant="headlineSmall">{fp}</Text></View>
          <View style={styles.cell}><Text variant="bodySmall">FN</Text><Text variant="headlineSmall">{fn}</Text></View>
          <View style={styles.cell}><Text variant="bodySmall">TN</Text><Text variant="headlineSmall">{tn}</Text></View>
        </View>
        <View style={styles.controls}>
          <StepControl label="True positives" value={tp} onDecrease={() => setTp((value) => Math.max(0, value - 1))} onIncrease={() => setTp((value) => value + 1)} />
          <StepControl label="False positives" value={fp} onDecrease={() => setFp((value) => Math.max(0, value - 1))} onIncrease={() => setFp((value) => value + 1)} />
          <StepControl label="False negatives" value={fn} onDecrease={() => setFn((value) => Math.max(0, value - 1))} onIncrease={() => setFn((value) => value + 1)} />
          <StepControl label="True negatives" value={tn} onDecrease={() => setTn((value) => Math.max(0, value - 1))} onIncrease={() => setTn((value) => value + 1)} />
        </View>
        <Text variant="bodyMedium">Accuracy: {(metrics.accuracy * 100).toFixed(1)}%</Text>
        <Text variant="bodyMedium">Precision: {(metrics.precision * 100).toFixed(1)}%</Text>
        <Text variant="bodyMedium">Recall: {(metrics.recall * 100).toFixed(1)}%</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
  },
  matrix: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cell: {
    width: '47%',
    minWidth: 120,
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#E8F0FE',
    gap: 4,
  },
  controls: {
    gap: 10,
  },
});
