import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';
import { FONTS, SIZES, BORDER, SHADOWS } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

interface TopAppBarProps {
  title?: string;
  showGreeting?: boolean;
  userName?: string;
  dateStr?: string;
  onPressMenu?: () => void;
  onPressNotification?: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function TopAppBar({
  title,
  showGreeting,
  userName = 'Carlos',
  dateStr,
  onPressNotification,
}: TopAppBarProps) {
  const { isDark, colors } = useTheme();
  const styles = makeStyles(colors, isDark);
  const initials = getInitials(userName);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        {showGreeting ? (
          <>
            {/* Avatar com iniciais */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>

            {/* Saudação */}
            <View style={styles.greetingTextCol}>
              <Text style={styles.greetingTitle} numberOfLines={1}>
              Olá, {userName.split(' ')[0]}
              </Text>
              {dateStr && (
                <Text style={styles.greetingSubtitle} numberOfLines={1}>
                  {dateStr}
                </Text>
              )}
            </View>

            {/* Sino de notificação */}
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={onPressNotification}
              activeOpacity={0.75}
            >
              <Bell size={19} color={colors.textPrimary} strokeWidth={2} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Título com barra lateral colorida */}
            <View style={styles.titleWrapper}>
              <View style={[styles.titleAccent, { backgroundColor: colors.primary }]} />
              <Text style={styles.title} numberOfLines={1}>
                {title || 'CampusFlow'}
              </Text>
            </View>

            {/* Sino de notificação */}
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={onPressNotification}
              activeOpacity={0.75}
            >
              <Bell size={19} color={colors.textPrimary} strokeWidth={2} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) {
  return StyleSheet.create({
    safeArea: {
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    container: {
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: colors.background,
      gap: 12,
    },

    // ─── Greeting Mode ──────────────────────────────────
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
    },
    avatarText: {
      fontFamily: FONTS.bold,
      fontSize: 15,
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    greetingTextCol: {
      flex: 1,
      justifyContent: 'center',
      gap: 1,
    },
    greetingTitle: {
      fontSize: SIZES.lg,
      fontFamily: FONTS.bold,
      color: colors.textPrimary,
      letterSpacing: -0.3,
    },
    greetingSubtitle: {
      fontSize: 11,
      fontFamily: FONTS.medium,
      color: colors.textSecondary,
      textTransform: 'capitalize',
    },

    // ─── Title Mode ─────────────────────────────────────
    titleWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    titleAccent: {
      width: 4,
      height: 22,
      borderRadius: 2,
    },
    title: {
      fontSize: SIZES.lg,
      color: colors.textPrimary,
      fontFamily: FONTS.bold,
      letterSpacing: -0.3,
    },

    // ─── Bell ────────────────────────────────────────────
    bellBtn: {
      width: 40,
      height: 40,
      backgroundColor: colors.surface,
      borderRadius: BORDER.radiusMd,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
      ...SHADOWS.light,
    },
    notifDot: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: colors.danger,
      borderWidth: 1.5,
      borderColor: colors.background,
    },
  });
}
