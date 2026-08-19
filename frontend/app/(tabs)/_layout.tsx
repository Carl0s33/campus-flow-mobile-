import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Calendar, BookOpen, CheckSquare } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONTS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const bottomPadding = Math.max(insets.bottom, 12);
  const barHeight = 60 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          height: barHeight,
          backgroundColor: colors.tabBar,
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: bottomPadding,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.12,
          shadowRadius: 10,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.bold,
          fontSize: 11,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendario"
        options={{
          title: 'Horário',
          tabBarIcon: ({ color }) => <Calendar size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="disciplinas"
        options={{
          title: 'Matérias',
          tabBarIcon: ({ color }) => <BookOpen size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Tarefas',
          tabBarIcon: ({ color }) => <CheckSquare size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
