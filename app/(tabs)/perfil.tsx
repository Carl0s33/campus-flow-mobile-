import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useCampusStore } from '@/hooks/useCampusStore';
import { useTheme } from '@/hooks/useTheme';
import { FONTS, SIZES, BORDER, SHADOWS } from '@/constants/theme';
import { Moon, Sun, LogOut, User } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PerfilScreen() {
  const { isDark, toggleTheme, colors } = useTheme();
  const userName = useCampusStore(state => state.userName);
  const matricula = useCampusStore(state => state.matricula);
  const logout = useCampusStore(state => state.logout);

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const styles = makeStyles(colors, isDark);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Perfil & Configurações</Text>

        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(userName || 'User')}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.matricula}>Matrícula: {matricula}</Text>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Aparência</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              {isDark ? <Moon size={20} color={colors.textPrimary} /> : <Sun size={20} color={colors.textPrimary} />}
              <Text style={styles.settingText}>Modo Escuro</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D5DB', true: colors.primary }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#D1D5DB"
            />
          </View>
        </View>

        <View style={[styles.settingsSection, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Conta</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <LogOut size={20} color={colors.danger} />
            <Text style={styles.logoutText}>Sair do App</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      padding: 24,
      paddingBottom: 40,
    },
    headerTitle: {
      fontSize: SIZES.xl,
      fontFamily: FONTS.bold,
      color: colors.textPrimary,
      marginBottom: 24,
    },
    profileSection: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 16,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: colors.borderLight,
      ...SHADOWS.light,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    avatarText: {
      fontFamily: FONTS.bold,
      fontSize: 24,
      color: '#FFFFFF',
    },
    profileInfo: {
      flex: 1,
    },
    userName: {
      fontSize: SIZES.lg,
      fontFamily: FONTS.bold,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    matricula: {
      fontSize: SIZES.md,
      fontFamily: FONTS.medium,
      color: colors.textSecondary,
    },
    settingsSection: {
      gap: 12,
    },
    sectionTitle: {
      fontSize: SIZES.sm,
      fontFamily: FONTS.bold,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 4,
      marginLeft: 4,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    settingText: {
      fontSize: SIZES.md,
      fontFamily: FONTS.medium,
      color: colors.textPrimary,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    logoutText: {
      fontSize: SIZES.md,
      fontFamily: FONTS.bold,
      color: colors.danger,
    },
  });
}
