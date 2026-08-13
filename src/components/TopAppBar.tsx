import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu, Bell, Moon, Sun } from 'lucide-react-native';
import { FONTS, SIZES, BORDER, SHADOWS } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

interface TopAppBarProps {
  title?: string;
  showGreeting?: boolean;
  userName?: string;
  dateStr?: string;
  onPressMenu?: () => void;
  onPressNotification?: () => void;
}

export default function TopAppBar({
  title,
  showGreeting,
  userName = 'Carlos',
  dateStr,
  onPressMenu,
  onPressNotification,
}: TopAppBarProps) {
  const { isDark, toggleTheme, colors } = useTheme();

  const styles = makeStyles(colors, isDark);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        {showGreeting ? (
          <>
            <View style={styles.greetingTextCol}>
              <Text style={styles.greetingTitle}>Olá, {userName}</Text>
              {dateStr && <Text style={styles.greetingSubtitle}>{dateStr}</Text>}
            </View>
            <View style={styles.rightRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={toggleTheme}
                activeOpacity={0.85}
              >
                {isDark ? (
                  <Sun size={18} color={colors.textPrimary} />
                ) : (
                  <Moon size={18} color={colors.textPrimary} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={onPressNotification}
                activeOpacity={0.85}
              >
                <Bell size={18} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.leftCol}>
              <TouchableOpacity style={styles.menuButton} onPress={onPressMenu} activeOpacity={0.85}>
                <Menu size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.centerCol}>
              <Text style={styles.title} numberOfLines={1}>{title || 'CampusFlow'}</Text>
            </View>

            <View style={styles.rightRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={toggleTheme} activeOpacity={0.85}>
                {isDark ? (
                  <Sun size={18} color={colors.textPrimary} />
                ) : (
                  <Moon size={18} color={colors.textPrimary} />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={onPressNotification} activeOpacity={0.85}>
                <Bell size={18} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
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
      height: 64,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      backgroundColor: colors.background,
    },
    leftCol: {
      width: 84, // Garante simetria perfeita com o lado direito (2 botões de 38px + gap de 8px)
      alignItems: 'flex-start',
    },
    centerCol: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuButton: {
      padding: 6,
    },
    title: {
      fontSize: SIZES.lg,
      color: colors.textPrimary,
      fontFamily: FONTS.bold,
      letterSpacing: -0.3,
      textAlign: 'center',
    },
    greetingTextCol: {
      justifyContent: 'center',
      gap: 2,
      flex: 1,
    },
    greetingTitle: {
      fontSize: SIZES.xl,
      fontFamily: FONTS.bold,
      color: colors.textPrimary,
      letterSpacing: -0.4,
    },
    greetingSubtitle: {
      fontSize: SIZES.xs,
      fontFamily: FONTS.medium,
      color: colors.textSecondary,
      textTransform: 'capitalize',
    },
    rightRow: {
      width: 84,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 8,
    },
    actionBtn: {
      width: 38,
      height: 38,
      backgroundColor: colors.surface,
      borderRadius: BORDER.radiusMd,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      ...SHADOWS.light,
    },
  });
}
