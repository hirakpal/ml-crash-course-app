import { line as d3Line } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, SegmentedButtons, Text } from 'react-native-paper';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { StepControl } from '../components/StepControl';

const WIDTH = 280;
const HEIGHT = 180;
const PADDING = 20;

type ActivationName = 'relu' | 'sigmoid' | 'tanh';

const activationFns: Record<ActivationName, (x: number) => number> = {
  relu: (x) => Math.max(0, x),
  sigmoid: (x) => 1 / (1 + Math.exp(-x)),
  tanh: (x) => Math.tanh(x),
};

export function ActivationFunctionVisualizer() {
  const [activation, setActivation] = useState<ActivationName>('relu');
  const [inputValue, setInputValue] = useState(0);

  const samples = useMemo(() => Array.from({ length: 41 }, (_, index) => -4 + index * 0.2).map((x) => ({ x, y: activationFns[activation](x) })), [activation]);
  const yDomain = activation === 'relu' ? [0, 4] : [-1, 1];
  const xScale = scaleLinear().domain([-4, 4]).range([PADDING, WIDTH - PADDING]);
  const yScale = scaleLinear().domain(yDomain).range([HEIGHT - PADDING, PADDING]);
  const path = d3Line<{ x: number; y: number }>()
    .x((point) => xScale(point.x))
    .y((point) => yScale(point.y))(samples) ?? '';

  const currentY = activationFns[activation](inputValue);

  return (
    <Card mode="outlined">
      <Card.Content style={styles.content}>
        <Text variant="titleMedium">Activation function explorer</Text>
        <SegmentedButtons
          value={activation}
          onValueChange={(value) => setActivation(value as ActivationName)}
          buttons={[
            { value: 'relu', label: 'ReLU' },
            { value: 'sigmoid', label: 'Sigmoid' },
            { value: 'tanh', label: 'Tanh' },
          ]}
        />
        <Svg width={WIDTH} height={HEIGHT}>
          <Line x1={PADDING} y1={HEIGHT / 2} x2={WIDTH - PADDING} y2={HEIGHT / 2} stroke="#B0BEC5" />
          <Line x1={WIDTH / 2} y1={PADDING} x2={WIDTH / 2} y2={HEIGHT - PADDING} stroke="#B0BEC5" />
          <Path d={path} stroke="#1A73E8" strokeWidth={3} fill="none" />
          <Circle cx={xScale(inputValue)} cy={yScale(currentY)} r={5} fill="#7C4DFF" />
        </Svg>
        <StepControl
          label={`Input x = ${inputValue.toFixed(1)}`}
          value={inputValue}
          onDecrease={() => setInputValue((value) => Math.max(-4, Number((value - 0.5).toFixed(1))))}
          onIncrease={() => setInputValue((value) => Math.min(4, Number((value + 0.5).toFixed(1))))}
        />
        <View style={styles.metrics}>
          <Text variant="bodyMedium">Output: {currentY.toFixed(3)}</Text>
          <Text variant="bodySmall">Change the activation to see how the same signal is transformed before flowing into the next layer.</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
  },
  metrics: {
    gap: 4,
  },
});
