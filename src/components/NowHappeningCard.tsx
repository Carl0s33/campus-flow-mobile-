import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, MapPin, User, ArrowRight, Plus, Sparkles } from 'lucide-react-native';
import { FONTS, SIZES, BORDER, SHADOWS, getContrastTextColor } from '../constants/theme'; 
import { useTheme } from '../hooks/useTheme';

interface NowHappeningCardProps {
  title?: string;
  startTime?: string;
  endTime?: string;
  room?: string;
  teacher?: string;
  isCurrent?: boolean;
  onPressDetails?: () => void;
  onPressAdd?: () => void;
}

export default function NowHappeningCard({
  title,
  startTime = '07:00',
  endTime = '10:20',
  room = 'Lab 04 - Bloco B',
  teacher = 'Prof. Leandro Luttiane',
  isCurrent = true,
  onPressDetails,
  onPressAdd,
}: NowHappeningCardProps) {
  const { colors, isDark } = useTheme();
  const styles = makeStyles(colors, isDark);

  // --- EMPTY STATE ---
  if (!title) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyHeader}>
          <Sparkles size={20} color={colors.primary} strokeWidth={2.2} />
          <Text style={styles.emptyTitle}>Sem aulas agora</Text>
        </View>
        <Text style={styles.emptySubtext}>
          Sua grade está livre no momento. Aproveite para focar nos seus prazos pendentes ou cadastrar novas disciplinas.
        </Text>
        <TouchableOpacity style={styles.emptyAddBtn} onPress={onPressAdd} activeOpacity={0.85}>
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.emptyAddBtnText}>Cadastrar Matéria</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const cardBg = colors.matteYellow;
  const cardTextColor = getContrastTextColor(cardBg);

  // --- POST-IT CARD ---
  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      {/* HEADER DO POST-IT */}
      <View style={styles.topHeaderRow}>
        <View style={styles.pinDot} /> 
        
        <View style={styles.badgePill}>
          <View style={[styles.badgeDot, { backgroundColor: cardTextColor }]} />
          <Text style={[styles.badgeText, { color: cardTextColor }]}>Acontecendo Agora</Text>
        </View>
      </View>

      {/* TÍTULO DA MATÉRIA */}
      <Text style={[styles.title, { color: cardTextColor }]} numberOfLines={2}>
        {title}
      </Text>

      {/* INFOS DA AULA (Estilo Tags Translúcidas com FONTS.medium) */}
      <View style={styles.pillTagsRow}>
        <View style={styles.pillTag}>
          <Clock size={14} color={cardTextColor} strokeWidth={2} />
          <Text style={[styles.pillTagText, { color: cardTextColor }]}>
            {startTime} - {endTime}
          </Text>
        </View>

        <View style={styles.pillTag}>
          <MapPin size={14} color={cardTextColor} strokeWidth={2} />
          <Text style={[styles.pillTagText, { color: cardTextColor }]}>{room}</Text>
        </View>

        {teacher && (
          <View style={styles.pillTag}>
            <User size={14} color={cardTextColor} strokeWidth={2} />
            <Text style={[styles.pillTagText, { color: cardTextColor }]}>{teacher}</Text>
          </View>
        )}
      </View>

      {/* BOTÃO DE AÇÃO */}
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={onPressDetails}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaButtonText}>Ver Detalhes</Text>
        <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
      </TouchableOpacity>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) {
  return StyleSheet.create({
    card: {
      borderRadius: 16,
      padding: 24, 
      marginBottom: 24,
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.08)',
      ...SHADOWS.postIt,
    },
    topHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    pinDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    badgePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(0, 0, 0, 0.06)',
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 20,
    },
    badgeDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
    },
    badgeText: {
      fontFamily: FONTS.bold,
      fontSize: SIZES.xs,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
    title: {
      fontFamily: FONTS.bold,
      fontSize: SIZES.xxl,
      lineHeight: 32,
      marginBottom: 20,
    },
    pillTagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8, 
      marginBottom: 24,
    },
    pillTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.45)', 
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: BORDER.radiusSm,
      gap: 6,
    },
    pillTagText: {
      fontFamily: FONTS.medium,
      fontSize: SIZES.sm,
    },
    ctaButton: {
      backgroundColor: colors.primary, 
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: BORDER.radiusSm,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 8,
      ...SHADOWS.light,
    },
    ctaButtonText: {
      color: '#FFFFFF', 
      fontFamily: FONTS.bold,
      fontSize: SIZES.sm,
    },
    emptyCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
      borderStyle: 'dashed',
      gap: 12,
      ...SHADOWS.light,
    },
    emptyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    emptyTitle: {
      fontFamily: FONTS.bold,
      fontSize: SIZES.lg,
      color: colors.textPrimary,
    },
    emptySubtext: {
      fontFamily: FONTS.regular,
      fontSize: SIZES.sm,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    emptyAddBtn: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: BORDER.radiusSm,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 8,
      marginTop: 6,
    },
    emptyAddBtnText: {
      color: '#FFFFFF',
      fontFamily: FONTS.bold,
      fontSize: SIZES.sm,
    },
  });
}