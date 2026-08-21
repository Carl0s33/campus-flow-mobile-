import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import NetInfo from '@react-native-community/netinfo';
import { useCampusStore } from '@/hooks/useCampusStore';
import { taskApi, disciplineApi } from '@/services/api';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { View, ActivityIndicator } from 'react-native';
import { ThemeProvider } from '@/hooks/useTheme';
import { useTheme } from '@/hooks/useTheme';
import { StatusBar } from 'expo-status-bar';

function AppContent() {
  const { isDark } = useTheme();
  
  const pendingPomodoros = useCampusStore(state => state.pendingPomodoros);
  const removePendingPomodoro = useCampusStore(state => state.removePendingPomodoro);

  // Background Sync Queue Listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && pendingPomodoros.length > 0) {
        console.log(`📡 Rede detectada. Processando ${pendingPomodoros.length} pomodoros offline...`);
        const processQueue = async () => {
          // Processa sequencialmente
          for (let i = 0; i < pendingPomodoros.length; i++) {
            const item = pendingPomodoros[i];
            try {
              if (item.type === 'task') {
                await taskApi.incrementPomodoro(item.id);
              } else if (item.type === 'discipline') {
                await disciplineApi.incrementPomodoro(item.id);
              }
              // Sempre remove o índice 0 pois a fila diminui a cada deleção
              removePendingPomodoro(0); 
            } catch (e) {
              console.warn(`⚠️ Erro no background sync de pomodoro (${item.type}):`, e);
              break; // Para o processamento em caso de erro (provavelmente a rede caiu novamente)
            }
          }
        };
        processQueue();
      }
    });

    return () => unsubscribe();
  }, [pendingPomodoros, removePendingPomodoro]);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="nova-disciplina" options={{ presentation: 'modal' }} />
        <Stack.Screen name="novo-horario" options={{ presentation: 'modal' }} />
        <Stack.Screen name="nova-tarefa" options={{ presentation: 'modal' }} />
        <Stack.Screen name="nova-prova" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' }}>
        <ActivityIndicator size="large" color="#818CF8" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
