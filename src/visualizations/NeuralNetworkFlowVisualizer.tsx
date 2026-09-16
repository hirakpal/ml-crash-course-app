import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { StepControl } from '../components/StepControl';

const positions = {
  inputs: [50, 120],
  hidden: [60, 100, 140],
  output: [100],
};

const relu = (value: number) => Math.max(0, value);

export function NeuralNetworkFlowVisualizer() {
  const [featureA, setFeatureA] = useState(0.6);
  const [featureB, setFeatureB] = useState(0.4);

  const hidden = useMemo(() => {
    const h1 = relu(featureA * 0.9 + featureB * 0.2 - 0.2);
    const h2 = relu(featureA * 0.4 + featureB * 0.8 - 0.1);
    const h3 = relu(featureA * 0.7 + featureB * 0.6 - 0.3);
    return [h1, h2, h3];
  }, [featureA, featureB]);

  const output = useMemo(() => Math.min(1, hidden[0] * 0.5 + hidden[1] * 0.3 + hidden[2] * 0.4), [hidden]);

  return (
    <Card mode="outlined">
      <Card.Content style={styles.content}>
        <Text variant="titleMedium">Neural network layer flow</Text>
        <Svg width={300} height={200}>
          {positions.inputs.map((y, inputIndex) =>
            positions.hidden.map((hiddenY, hiddenIndex) => (
              <Line
                key={`input-${inputIndex}-hidden-${hiddenIndex}`}
                x1={40}
                y1={y}
                x2={150}
                y2={hiddenY}
                stroke="#B0BEC5"
                strokeWidth={2}
                opacity={0.5 + [featureA, featureB][inputIndex] / 2}
              />
            ))
          )}
          {positions.hidden.map((y, hiddenIndex) => (
            <Line
              key={`hidden-${hiddenIndex}-output`}
              x1={150}
              y1={y}
              x2={260}
              y2={positions.output[0]}
              stroke="#7C4DFF"
              strokeWidth={2}
              opacity={0.5 + hidden[hiddenIndex] / 2}
            />
          ))}

          {positions.inputs.map((y, index) => (
            <>
              <Circle key={`input-node-${index}`} cx={40} cy={y} r={18} fill="#1A73E8" />
              <SvgText x={40} y={y + 4} fontSize="10" fill="#fff" textAnchor="middle">{[featureA, featureB][index].toFixed(2)}</SvgText>
            </>
          ))}
          {positions.hidden.map((y, index) => (
            <>
              <Circle key={`hidden-node-${index}`} cx={150} cy={y} r={18} fill="#7C4DFF" />
              <SvgText x={150} y={y + 4} fontSize="10" fill="#fff" textAnchor="middle">{hidden[index].toFixed(2)}</SvgText>
            </>
          ))}
          <Circle cx={260} cy={positions.output[0]} r={20} fill="#146C2E" />
          <SvgText x={260} y={positions.output[0] + 4} fontSize="10" fill="#fff" textAnchor="middle">{output.toFixed(2)}</SvgText>
        </Svg>
        <View style={styles.controls}>
          <StepControl
            label="Feature A"
            value={featureA}
            onDecrease={() => setFeatureA((value) => Math.max(0, Number((value - 0.1).toFixed(2))))}
            onIncrease={() => setFeatureA((value) => Math.min(1, Number((value + 0.1).toFixed(2))))}
          />
          <StepControl
            label="Feature B"
            value={featureB}
            onDecrease={() => setFeatureB((value) => Math.max(0, Number((value - 0.1).toFixed(2))))}
            onIncrease={() => setFeatureB((value) => Math.min(1, Number((value + 0.1).toFixed(2))))}
          />
        </View>
        <Text variant="bodySmall">Watch how changing the inputs alters hidden activations and the final prediction strength.</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
  },
  controls: {
    gap: 12,
  },
});
