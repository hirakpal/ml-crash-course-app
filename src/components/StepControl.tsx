import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export function StepControl({ label, value, onDecrease, onIncrease }: { label: string; value: number; onDecrease: () => void; onIncrease: () => void; }) {
  return (
    <View style={styles.container}>
      <Text variant="bodyMedium">{label}</Text>
      <View style={styles.controls}>
        <Button
          mode="outlined"
          compact
          onPress={onDecrease}
          accessibilityLabel={`Decrease ${label}`}
        >
          -
        </Button>
        <Text variant="titleMedium">{value.toFixed(2)}</Text>
        <Button
          mode="outlined"
          compact
          onPress={onIncrease}
          accessibilityLabel={`Increase ${label}`}
        >
          +
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
