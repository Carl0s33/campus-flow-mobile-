import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu, Bell } from 'lucide-react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TopAppBarProps {
  title?: string;
  showGreeting?: boolean;
  userName?: string;
  dateStr?: string;
}

export default function TopAppBar({ title, showGreeting, userName, dateStr }: TopAppBarProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        {showGreeting ? (
          <View style={styles.greetingRow}>
            <View style={styles.avatarPlaceholder} />
            <View style={styles.greetingTextContainer}>
              <Text style={styles.greetingTitle}>Olá, {userName}!</Text>
              <Text style={styles.greetingSubtitle}>{dateStr}</Text>
            </View>
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.iconButton}>
              <Menu size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.title}>{title || 'CampusFlow'}</Text>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </>
        )}

        {showGreeting && (
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
  },
  container: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },
  iconButton: {
    padding: 8,
  },
  title: {
    fontSize: SIZES.xxl,
    color: COLORS.primaryDark,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 2,
  },
  greetingTextContainer: {
    justifyContent: 'center',
  },
  greetingTitle: {
    fontSize: SIZES.xxl,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  greetingSubtitle: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
});
