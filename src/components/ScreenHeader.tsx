import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FONTS, SIZES } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface ScreenHeaderProps {
  title: string;
}

export function ScreenHeader({ title }: ScreenHeaderProps) {
  const router = useRouter();
  const { colors } = useTheme();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
      <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{title}</Text>
      <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
        <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    borderBottomWidth: 1, 
  },
  headerTitle: { 
    fontFamily: FONTS.bold, 
    fontSize: SIZES.lg, 
  },
  cancelText: { 
    fontFamily: FONTS.medium, 
    fontSize: SIZES.md, 
  },
});
