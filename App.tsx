import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, MD3LightTheme, PaperProvider, Text } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useAppContext } from './src/redux/AppContext';
import { AppShell } from './src/screens/AppShell';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1A73E8',
    secondary: '#7C4DFF',
    background: '#F8FAFF',
    surface: '#FFFFFF',
    surfaceVariant: '#E8F0FE',
  },
};

function AppContent() {
  const { isReady } = useAppContext();

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text variant="bodyLarge">Loading your offline ML curriculum…</Text>
      </View>
    );
  }

  return <AppShell />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AppProvider>
          <StatusBar style="dark" />
          <AppContent />
        </AppProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
    backgroundColor: '#F8FAFF',
  },
});
