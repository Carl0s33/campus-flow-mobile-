import { Platform } from 'react-native';
import Constants from 'expo-constants';

let Notifications: any = null;

try {
  // Em Expo Go no Android (SDK 53+), expo-notifications pode causar um crash.
  // Carregamos condicionalmente para evitar o fechamento do app.
  if (Platform.OS === 'android' && Constants.appOwnership === 'expo') {
    console.warn('Push notifications nativas desativadas no Expo Go Android (SDK 53+)');
  } else {
    Notifications = require('expo-notifications');
  }
} catch (e) {
  console.warn('Erro ao carregar expo-notifications', e);
}

// Mock de fallback para evitar que o resto do código quebre
if (!Notifications) {
  Notifications = {
    setNotificationHandler: () => {},
    getPermissionsAsync: async () => ({ status: 'undetermined' }),
    requestPermissionsAsync: async () => ({ status: 'undetermined' }),
    setNotificationChannelAsync: async () => {},
    scheduleNotificationAsync: async () => {},
    AndroidImportance: { MAX: 5 },
    SchedulableTriggerInputTypes: { TIME_INTERVAL: 1 }
  };
}

if (Platform.OS !== 'web' && typeof Notifications.setNotificationHandler === 'function') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function requestNotificationPermissions() {
  if (Platform.OS === 'web') return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#EF4444',
    });
  }
  
  return finalStatus === 'granted';
}

export async function scheduleAbsenceWarning(disciplineName: string, absencesLeft: number) {
  if (Platform.OS === 'web') return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🚨 Alerta de Reprovação',
      body: `Atenção: Você só tem mais ${absencesLeft} ${absencesLeft === 1 ? 'falta permitida' : 'faltas permitidas'} em ${disciplineName}.`,
      sound: true,
    },
    trigger: null, // trigger immediately
  });
}

export async function scheduleClassReminder(disciplineName: string, room: string, time: string) {
  if (Platform.OS === 'web') return;

  // Simulating an upcoming class reminder 15 minutes before
  // For demo purposes, we will trigger it 5 seconds from now if it's called
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📚 Aula Começando em Breve',
      body: `${disciplineName} começa às ${time} na sala ${room}.`,
      sound: true,
    },
    trigger: {
      seconds: 5,
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    },
  });
}
