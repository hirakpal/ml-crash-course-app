import { line as d3Line } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Card, SegmentedButtons, Text } from 'react-native-paper';
import Svg, { Circle, Path } from 'react-native-svg';

const WIDTH = 280;
const HEIGHT = 180;
const PADDING = 20;

const learningRates = {
  slow: 0.03,
  balanced: 0.12,
  aggressive: 0.28,
};

type LearningRatePreset = keyof typeof learningRates;

function buildLossCurve(rate: number) {
  let weight = 2.4;
  return Array.from({ length: 14 }, (_, epoch) => {
    const gradient = 2 * weight;
    weight -= rate * gradient;
    const loss = weight * weight;
    return { epoch, loss };
  });
}

export function TrainingSimulator() {
  const [preset, setPreset] = useState<LearningRatePreset>('balanced');
  const rate = learningRates[preset];
  const points = useMemo(() => buildLossCurve(rate), [rate]);
  const xScale = scaleLinear().domain([0, points.length - 1]).range([PADDING, WIDTH - PADDING]);
  const maxLoss = Math.max(...points.map((point) => point.loss), 0.1);
  const yScale = scaleLinear().domain([0, maxLoss]).range([HEIGHT - PADDING, PADDING]);
  const path = d3Line<{ epoch: number; loss: number }>()
    .x((point) => xScale(point.epoch))
    .y((point) => yScale(point.loss))(points) ?? '';
  const latest = points[points.length - 1];

  return (
    <Card mode="outlined">
      <Card.Content style={styles.content}>
        <Text variant="titleMedium">Learning rate and loss curve simulator</Text>
        <SegmentedButtons
          value={preset}
          onValueChange={(value) => setPreset(value as LearningRatePreset)}
          buttons={[
            { value: 'slow', label: 'Slow' },
            { value: 'balanced', label: 'Balanced' },
            { value: 'aggressive', label: 'Aggressive' },
          ]}
        />
        <Svg width={WIDTH} height={HEIGHT}>
          <Path d={path} stroke="#1A73E8" strokeWidth={3} fill="none" />
          {points.map((point) => (
            <Circle key={point.epoch} cx={xScale(point.epoch)} cy={yScale(point.loss)} r={3} fill="#7C4DFF" />
          ))}
        </Svg>
        <Text variant="bodyMedium">Rate: {rate.toFixed(2)} · final loss: {latest.loss.toFixed(4)}</Text>
        <Text variant="bodySmall">
          Slow rates converge steadily, balanced rates learn quickly, and aggressive rates risk overshooting. Use this to explain why tuning optimization matters.
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
  },
});
