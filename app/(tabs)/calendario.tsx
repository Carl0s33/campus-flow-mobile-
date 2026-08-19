import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampusStore } from '@/hooks/useCampusStore';
import TopAppBar from '@/components/TopAppBar';
import { COLORS, MATTE_COLORS, FONTS, SIZES, BORDER, SHADOWS, getContrastTextColor } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { MapPin, Plus, User, Calendar as CalendarIcon } from 'lucide-react-native';
import { mergeSequentialSchedules } from '@/utils/scheduleHelpers';

const DAYS = [
  { label: 'Segunda', short: 'Seg', val: 1 },
  { label: 'Terça', short: 'Ter', val: 2 },
  { label: 'Quarta', short: 'Qua', val: 3 },
  { label: 'Quinta', short: 'Qui', val: 4 },
  { label: 'Sexta', short: 'Sex', val: 5 },
];

export default function CalendarioScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const schedules = useCampusStore(state => state.schedules);
  const disciplines = useCampusStore(state => state.disciplines);

  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay() || 1);

  const daySchedules = schedules
    .filter(s => s.dayOfWeek === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const mergedSchedules = mergeSequentialSchedules(daySchedules);

  const styles = makeStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <TopAppBar title="Horário Semanal" />

      {/* HEADER & DAY SELECTOR */}
      <View style={styles.headerContainer}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.pageTitle}>Horário Semanal</Text>
            <Text style={styles.pageSubtitle}>TADS • Período 2026.2 (Matutino)</Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/novo-horario')}
            style={styles.addButton}
            activeOpacity={0.8}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Day Selector Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
          {DAYS.map(day => {
            const isActive = day.val === selectedDay;
            return (
              <TouchableOpacity
                key={day.val}
                style={[styles.dayButton, isActive && styles.dayButtonActive]}
                onPress={() => setSelectedDay(day.val)}
              >
                <Text style={[styles.dayText, isActive && styles.dayTextActive]}>{day.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* CONTENT AREA: DAY TIMELINE */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {mergedSchedules.length === 0 ? (
          <View style={styles.emptyCard}>
            <CalendarIcon size={24} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>Sem aulas neste dia</Text>
            <Text style={styles.emptySubtext}>Seu mural de anotações está livre para o dia selecionado.</Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/novo-horario')}
              activeOpacity={0.8}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.emptyBtnText}>Adicionar Horário</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.timelineContainer}>
            {mergedSchedules.map((item, idx) => {
              const discipline = disciplines.find(d => d.id === item.disciplineId);
              const matteColor = discipline?.color || MATTE_COLORS[idx % MATTE_COLORS.length];
              const cardTextColor = getContrastTextColor(matteColor);

              return (
                <View key={item.id} style={styles.slotRow}>
                  <View style={styles.timeColumn}>
                    <Text style={styles.timeStartText}>{item.startTime}</Text>
                    <View style={styles.timeDividerLine} />
                    <Text style={styles.timeEndText}>{item.endTime}</Text>
                  </View>

                  <View style={[styles.postItCard, { backgroundColor: matteColor }]}>
                    <View style={styles.cardHeader}>
                      <View style={styles.pinDot} />
                      {discipline?.code && (
                        <View style={styles.codeBadge}>
                          <Text style={[styles.codeBadgeText, { color: cardTextColor }]}>{discipline.code}</Text>
                        </View>
                      )}
                    </View>

                    <Text style={[styles.classTitle, { color: cardTextColor }]}>{discipline?.name || 'Disciplina'}</Text>

                    {item.isMerged && (
                      <View style={styles.mergedDivider}>
                         {item.midTimes.map(t => (
                           <Text key={t} style={[styles.mergedDividerText, { color: cardTextColor }]}>--- {t} ---</Text>
                         ))}
                      </View>
                    )}

                    <View style={styles.metaRow}>
                      <View style={styles.metaChip}>
                        <MapPin size={12} color={cardTextColor} />
                        <Text style={[styles.metaText, { color: cardTextColor }]}>{item.room || 'Sala N/A'}</Text>
                      </View>
                      {discipline?.teacher && (
                        <View style={styles.metaChip}>
                          <User size={12} color={cardTextColor} />
                          <Text style={[styles.metaText, { color: cardTextColor }]}>{discipline.teacher}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    headerContainer: { paddingVertical: 14, backgroundColor: colors.background },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 14 },
    pageTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: colors.textPrimary },
    pageSubtitle: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: colors.textSecondary, marginTop: 2 },
    addButton: { padding: 10, backgroundColor: colors.primary, borderRadius: BORDER.radiusSm, ...SHADOWS.postIt },
    daysScroll: { paddingHorizontal: 24, gap: 8 },
    dayButton: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 9999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    dayButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    dayText: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: colors.textSecondary },
    dayTextActive: { color: '#FFFFFF' },
    scrollContent: { padding: 24, paddingBottom: 110 },
    timelineContainer: { gap: 16 },
    slotRow: { flexDirection: 'row', gap: 12, alignItems: 'stretch' },
    timeColumn: {
      width: 60, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface,
      paddingVertical: 12, borderRadius: BORDER.radiusLg, borderWidth: 1, borderColor: colors.border, ...SHADOWS.light,
    },
    timeStartText: { fontFamily: FONTS.bold, fontSize: SIZES.xs, color: colors.textPrimary },
    timeDividerLine: { width: 1, height: 12, backgroundColor: colors.border, marginVertical: 4 },
    timeEndText: { fontFamily: FONTS.medium, fontSize: 10, color: colors.textSecondary },
    postItCard: {
      flex: 1, borderRadius: BORDER.radiusLg, padding: 18,
      borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...SHADOWS.postIt,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    pinDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.25)' },
    codeBadge: { backgroundColor: 'rgba(0,0,0,0.08)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    codeBadgeText: { fontFamily: FONTS.bold, fontSize: 10 },
    classTitle: { fontFamily: FONTS.bold, fontSize: SIZES.md, marginBottom: 10, lineHeight: 22 },
    mergedDivider: { borderTopWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(0,0,0,0.1)', paddingTop: 8, marginTop: 4, marginBottom: 12 },
    mergedDividerText: { fontFamily: FONTS.medium, fontSize: 10, opacity: 0.6, textAlign: 'center' },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    metaChip: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      backgroundColor: 'rgba(0,0,0,0.07)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: BORDER.radiusSm,
    },
    metaText: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs },
    emptyCard: {
      backgroundColor: colors.surface, borderRadius: BORDER.radiusLg, padding: 24,
      borderWidth: 1, borderColor: colors.border, alignItems: 'center', gap: 10, ...SHADOWS.postIt,
    },
    emptyTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: colors.textPrimary },
    emptySubtext: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: colors.textSecondary, textAlign: 'center' },
    emptyBtn: {
      backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 20,
      borderRadius: BORDER.radiusSm, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6,
    },
    emptyBtnText: { color: '#FFFFFF', fontFamily: FONTS.bold, fontSize: SIZES.sm },
  });
}
