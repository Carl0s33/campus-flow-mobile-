import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampusStore } from '../../hooks/useCampusStore';
import TopAppBar from '../../src/components/TopAppBar';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Plus } from 'lucide-react-native';

export default function DisciplinasScreen() {
  const router = useRouter();
  const disciplines = useCampusStore(state => state.disciplines);
  const incrementAbsence = useCampusStore(state => state.incrementAbsence);

  return (
    <View style={styles.container}>
      <TopAppBar />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Minhas Matérias</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/nova-disciplina')}>
            <Plus size={20} color={COLORS.surface} />
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {disciplines.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Você ainda não possui matérias cadastradas.</Text>
              <TouchableOpacity 
                style={styles.emptyBtn} 
                onPress={() => router.push('/nova-disciplina')}
              >
                <Text style={styles.emptyBtnText}>Cadastrar Primeira Matéria</Text>
                <Plus size={16} color={COLORS.surface} />
              </TouchableOpacity>
            </View>
          ) : (
            disciplines.map(subject => {
              const hasAbsences = subject.absences > 0;
              return (
                <View key={subject.id} style={styles.card}>
                  <View style={[styles.cardTop, { backgroundColor: subject.color }]} />
                  <View style={styles.cardBody}>
                    <View>
                      <Text style={styles.subjectTitle}>{subject.name}</Text>
                      {subject.teacher && <Text style={styles.professorText}>{subject.teacher}</Text>}
                    </View>
                    
                    <View style={styles.absenceRow}>
                      <View style={[styles.absenceBadge, hasAbsences ? styles.absenceBadgeRed : styles.absenceBadgeGreen]}>
                        <Text style={[styles.absenceText, hasAbsences ? styles.absenceTextRed : styles.absenceTextGreen]}>
                          {subject.absences} faltas
                        </Text>
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.addAbsenceBtn}
                        onPress={() => incrementAbsence(subject.id)}
                      >
                        <Text style={styles.addAbsenceBtnText}>+ Falta</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  pageTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.textPrimary },
  addButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 },
  grid: { gap: 24 },
  emptyContainer: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: COLORS.borderLight, alignItems: 'center', gap: 16, marginTop: 16 },
  emptyText: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, textAlign: 'center' },
  emptyBtn: { backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  emptyBtnText: { color: COLORS.surface, fontFamily: FONTS.bold, fontSize: SIZES.sm },
  card: { backgroundColor: COLORS.surface, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 2 },
  cardTop: { height: 128, width: '100%' },
  cardBody: { padding: 24, gap: 16 },
  subjectTitle: { fontFamily: FONTS.semiBold, fontSize: SIZES.lg, color: COLORS.textPrimary, marginBottom: 4 },
  professorText: { fontFamily: FONTS.regular, fontSize: SIZES.md, color: COLORS.textSecondary },
  absenceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  absenceBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 },
  absenceBadgeRed: { backgroundColor: COLORS.accentRedLight },
  absenceBadgeGreen: { backgroundColor: COLORS.accentGreen },
  absenceText: { fontFamily: FONTS.medium, fontSize: SIZES.xs },
  absenceTextRed: { color: '#93000a' },
  absenceTextGreen: { color: '#476c5b' },
  addAbsenceBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: COLORS.background, borderRadius: 8 },
  addAbsenceBtnText: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.textPrimary },
});
