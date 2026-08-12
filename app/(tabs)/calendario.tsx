import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampusStore } from '../../hooks/useCampusStore';
import TopAppBar from '../../src/components/TopAppBar';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { MapPin, Plus } from 'lucide-react-native';

const DAYS = [
  { label: 'Seg', val: 1 },
  { label: 'Ter', val: 2 },
  { label: 'Qua', val: 3 },
  { label: 'Qui', val: 4 },
  { label: 'Sex', val: 5 },
  { label: 'Sáb', val: 6 },
];

export default function CalendarioScreen() {
  const router = useRouter();
  const schedules = useCampusStore(state => state.schedules);
  const disciplines = useCampusStore(state => state.disciplines);
  const [selectedDay, setSelectedDay] = useState(1);

  const daySchedules = schedules
    .filter(s => s.dayOfWeek === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <View style={styles.container}>
      <TopAppBar />
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Horário</Text>
          <TouchableOpacity onPress={() => router.push('/novo-horario')} style={styles.addButton}>
            <Plus size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
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
            )
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.timelineScroll} showsVerticalScrollIndicator={false}>
        {daySchedules.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Sem aulas cadastradas neste dia.</Text>
            <TouchableOpacity 
              style={styles.emptyBtn} 
              onPress={() => router.push('/novo-horario')}
            >
              <Text style={styles.emptyBtnText}>Adicionar Horário</Text>
              <Plus size={16} color={COLORS.surface} />
            </TouchableOpacity>
          </View>
        ) : (
          daySchedules.map((item) => {
            const discipline = disciplines.find(d => d.id === item.disciplineId);
            return (
              <View key={item.id} style={styles.classCard}>
                <View style={[styles.cardAccent, { backgroundColor: discipline?.color || COLORS.primary }]} />
                <View style={styles.timeCol}>
                  <Text style={styles.timeText}>{item.startTime}</Text>
                  <Text style={styles.durationText}>{item.endTime}</Text>
                </View>
                <View style={styles.detailsCol}>
                  <Text style={styles.classTitle}>{discipline?.name || 'Sem Matéria'}</Text>
                  <View style={styles.infoRow}>
                    <MapPin size={14} color={COLORS.textSecondary} />
                    <Text style={styles.infoText}>{item.room}</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingVertical: 16, backgroundColor: 'rgba(248,249,250,0.95)' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  pageTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.textPrimary },
  addButton: { padding: 8, backgroundColor: COLORS.primaryLight, borderRadius: 8 },
  daysScroll: { paddingHorizontal: 20, gap: 8 },
  dayButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999, borderWidth: 1, borderColor: COLORS.border },
  dayButtonActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dayText: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.textSecondary },
  dayTextActive: { color: COLORS.surface },
  timelineScroll: { padding: 20, paddingBottom: 100, gap: 16 },
  emptyContainer: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: COLORS.borderLight, alignItems: 'center', gap: 16, marginTop: 16 },
  emptyText: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, textAlign: 'center' },
  emptyBtn: { backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  emptyBtnText: { color: COLORS.surface, fontFamily: FONTS.bold, fontSize: SIZES.sm },
  classCard: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 24, flexDirection: 'row',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 2,
    overflow: 'hidden', position: 'relative', gap: 16,
  },
  cardAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  timeCol: { minWidth: 80 },
  timeText: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.textPrimary, marginBottom: 4 },
  durationText: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.textTertiary },
  detailsCol: { flex: 1 },
  classTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.textPrimary, marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  infoText: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.textSecondary },
});
