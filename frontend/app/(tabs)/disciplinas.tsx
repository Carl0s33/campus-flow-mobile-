import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampusStore } from '@/hooks/useCampusStore';
import TopAppBar from '@/components/TopAppBar';
import { MATTE_COLORS, FONTS, SIZES, BORDER, SHADOWS, getContrastTextColor } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { Plus, BookOpen, Code, Cpu, Calculator, Compass, Atom, Trash2, AlertTriangle, GraduationCap, X } from 'lucide-react-native';
import { scheduleAbsenceWarning } from '@/hooks/useNotifications';

const SUBJECT_ICONS = [Code, BookOpen, Calculator, Cpu, Compass, Atom];

function calculateStatus(n1?: number, n2?: number): { text: string; color: string } {
  if (n1 !== undefined && n2 !== undefined) {
    const media = (n1 * 2 + n2 * 3) / 5;
    if (media >= 6) return { text: `Média: ${media.toFixed(1)} - Aprovado`, color: '#10B981' };
    return { text: `Média: ${media.toFixed(1)} - Prova Final`, color: '#EF4444' };
  } else if (n1 !== undefined) {
    const requiredN2 = (30 - n1 * 2) / 3;
    if (requiredN2 <= 10) {
      return { text: `Precisa de ${requiredN2.toFixed(1)} na N2`, color: '#F59E0B' };
    } else {
      return { text: `Reprovado (N2 inviável)`, color: '#EF4444' };
    }
  }
  return { text: 'Sem notas lançadas', color: '#6B7280' };
}

export default function DisciplinasScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const disciplines = useCampusStore(state => state.disciplines);
  const incrementAbsence = useCampusStore(state => state.incrementAbsence);
  const decrementAbsence = useCampusStore(state => state.decrementAbsence);
  const removeDiscipline = useCampusStore(state => state.removeDiscipline);
  const setGrade = useCampusStore(state => state.setGrade);

  const [gradeModalVisible, setGradeModalVisible] = useState(false);
  const [editingDiscipline, setEditingDiscipline] = useState<string | null>(null);
  const [n1Input, setN1Input] = useState('');
  const [n2Input, setN2Input] = useState('');

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Remover Matéria',
      `Deseja realmente remover a matéria "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => removeDiscipline(id) },
      ]
    );
  };

  const styles = makeStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <TopAppBar title="Minhas Matérias" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Minhas Matérias</Text>
            <Text style={styles.pageSubtitle}>{disciplines.length} disciplinas em 2026.2</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/nova-disciplina')} activeOpacity={0.8}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {disciplines.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Sua grade de matérias está vazia</Text>
            <Text style={styles.emptyText}>Cadastre suas matérias para organizar seus horários e faltas.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/nova-disciplina')}>
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.emptyBtnText}>Cadastrar Primeira Matéria</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {disciplines.map((subject, idx) => {
              const matteColor = subject.color || MATTE_COLORS[idx % MATTE_COLORS.length];
              const IconComp = SUBJECT_ICONS[idx % SUBJECT_ICONS.length];
              const maxAbsences = subject.workload ? Math.floor(subject.workload / 4) : 15;
              const isWarning = subject.absences >= maxAbsences;
              const cardTextColor = getContrastTextColor(matteColor);

              return (
                <View key={subject.id} style={[styles.squareCard, { backgroundColor: matteColor }]}>
                  <View style={styles.cardHeader}>
                    <View style={styles.pinDot} />
                    <View style={styles.headerIconsRow}>
                      <TouchableOpacity
                        onPress={() => handleDelete(subject.id, subject.name)}
                        style={styles.trashBtn}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Trash2 size={14} color={cardTextColor} style={{ opacity: 0.6 }} />
                      </TouchableOpacity>
                      <View style={styles.iconCircle}>
                        <IconComp size={15} color={cardTextColor} />
                      </View>
                    </View>
                  </View>

                  <View style={styles.cardBody}>
                    {subject.code && (
                      <Text style={[styles.codeText, { color: cardTextColor }]}>{subject.code}</Text>
                    )}
                    <Text style={[styles.subjectTitle, { color: cardTextColor }]} numberOfLines={2}>{subject.name}</Text>
                    <Text style={[styles.professorText, { color: cardTextColor }]} numberOfLines={1}>{subject.teacher || 'Professor a definir'}</Text>
                  </View>

                  <View style={[styles.absenceRow, isWarning && styles.absenceRowWarning]}>
                    <View style={styles.absenceInfo}>
                      {isWarning && <AlertTriangle size={12} color="#EF4444" />}
                      <Text style={[styles.absenceCount, { color: cardTextColor }, isWarning && styles.absenceCountWarning]}>
                        {subject.absences} / {maxAbsences} {subject.absences === 1 ? 'falta' : 'faltas'}
                      </Text>
                    </View>
                    <View style={styles.absenceActions}>
                      {subject.absences > 0 && (
                        <TouchableOpacity
                          style={styles.absenceMinusBtn}
                          onPress={() => decrementAbsence(subject.id)}
                          activeOpacity={0.8}
                          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        >
                          <Text style={[styles.absenceBtnText, { color: cardTextColor }]}>-</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={[styles.absenceBtn, isWarning && styles.absenceBtnWarning]}
                        onPress={() => {
                          incrementAbsence(subject.id);
                          if (subject.absences + 1 === maxAbsences) {
                            scheduleAbsenceWarning(subject.name, 0);
                          } else if (subject.absences + 1 === maxAbsences - 2) {
                            scheduleAbsenceWarning(subject.name, 2);
                          }
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.absenceBtnText, { color: cardTextColor }, isWarning && styles.absenceBtnTextWarning]}>
                          + Falta
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.gradesRow}>
                    <View style={styles.gradesHeader}>
                      <GraduationCap size={14} color={cardTextColor} />
                      <Text style={[styles.gradesTitle, { color: cardTextColor }]}>Situação (Notas)</Text>
                    </View>
                    <Text style={[styles.gradesStatus, { color: calculateStatus(subject.grades?.n1, subject.grades?.n2).color }]}>
                      {calculateStatus(subject.grades?.n1, subject.grades?.n2).text}
                    </Text>
                    <TouchableOpacity
                      style={styles.addGradeBtn}
                      onPress={() => {
                        setEditingDiscipline(subject.id);
                        setN1Input(subject.grades?.n1 !== undefined ? String(subject.grades.n1) : '');
                        setN2Input(subject.grades?.n2 !== undefined ? String(subject.grades.n2) : '');
                        setGradeModalVisible(true);
                      }}
                    >
                      <Text style={styles.addGradeBtnText}>Lançar Notas</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* MODAL DE NOTAS */}
      <Modal visible={gradeModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lançar Notas</Text>
              <TouchableOpacity onPress={() => setGradeModalVisible(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nota 1 (Peso 2)</Text>
                <TextInput
                  style={styles.gradeInput}
                  keyboardType="numeric"
                  value={n1Input}
                  onChangeText={setN1Input}
                  placeholder="0.0 a 10.0"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nota 2 (Peso 3)</Text>
                <TextInput
                  style={styles.gradeInput}
                  keyboardType="numeric"
                  value={n2Input}
                  onChangeText={setN2Input}
                  placeholder="0.0 a 10.0"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveGradeBtn}
              onPress={() => {
                if (editingDiscipline) {
                  const val1 = n1Input ? parseFloat(n1Input.replace(',', '.')) : undefined;
                  const val2 = n2Input ? parseFloat(n2Input.replace(',', '.')) : undefined;
                  setGrade(editingDiscipline, isNaN(val1!) ? undefined : val1, isNaN(val2!) ? undefined : val2);
                }
                setGradeModalVisible(false);
              }}
            >
              <Text style={styles.saveGradeBtnText}>Salvar Notas</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { padding: 24, paddingBottom: 110 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    pageTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: colors.textPrimary },
    pageSubtitle: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: colors.textSecondary, marginTop: 2 },
    addButton: {
      width: 44, height: 44, borderRadius: BORDER.radiusSm,
      backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', ...SHADOWS.postIt,
    },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'space-between' },
    squareCard: {
      width: '48%', borderRadius: BORDER.radiusLg, padding: 14,
      borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', justifyContent: 'space-between', ...SHADOWS.postIt,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    pinDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.25)' },
    headerIconsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    trashBtn: { padding: 2 },
    iconCircle: {
      width: 26, height: 26, borderRadius: 13,
      backgroundColor: 'rgba(0,0,0,0.08)', justifyContent: 'center', alignItems: 'center',
    },
    cardBody: { gap: 2, marginVertical: 4 },
    codeText: { fontFamily: FONTS.bold, fontSize: SIZES.xs, textTransform: 'uppercase', letterSpacing: 0.5, opacity: 0.7 },
    subjectTitle: { fontFamily: FONTS.bold, fontSize: SIZES.sm, lineHeight: 18 },
    professorText: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs, opacity: 0.8 },
    absenceRow: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.07)', paddingHorizontal: 8, paddingVertical: 5, borderRadius: BORDER.radiusSm,
    },
    absenceRowWarning: { backgroundColor: 'rgba(239,68,68,0.15)' },
    absenceInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    absenceCount: { fontFamily: FONTS.bold, fontSize: SIZES.xs },
    absenceCountWarning: { color: '#EF4444' },
    absenceActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    absenceMinusBtn: { backgroundColor: 'rgba(0,0,0,0.12)', width: 22, height: 20, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
    absenceBtn: { backgroundColor: 'rgba(0,0,0,0.12)', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4 },
    absenceBtnWarning: { backgroundColor: '#EF4444' },
    absenceBtnText: { fontFamily: FONTS.bold, fontSize: 10 },
    absenceBtnTextWarning: { color: '#FFFFFF' },
    emptyContainer: {
      backgroundColor: colors.surface, borderRadius: BORDER.radiusLg, padding: 24,
      borderWidth: 1, borderColor: colors.border, alignItems: 'center', gap: 12, ...SHADOWS.postIt,
    },
    emptyTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: colors.textPrimary },
    emptyText: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: colors.textSecondary, textAlign: 'center' },
    emptyBtn: {
      backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 18,
      borderRadius: BORDER.radiusSm, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4,
    },
    emptyBtnText: { color: '#FFFFFF', fontFamily: FONTS.bold, fontSize: SIZES.sm },
    gradesRow: { marginTop: 12, backgroundColor: 'rgba(0,0,0,0.04)', padding: 8, borderRadius: BORDER.radiusSm },
    gradesHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
    gradesTitle: { fontFamily: FONTS.bold, fontSize: 10, textTransform: 'uppercase' },
    gradesStatus: { fontFamily: FONTS.bold, fontSize: SIZES.xs, marginBottom: 8 },
    addGradeBtn: { backgroundColor: 'rgba(0,0,0,0.08)', paddingVertical: 6, borderRadius: 4, alignItems: 'center' },
    addGradeBtnText: { fontFamily: FONTS.semiBold, fontSize: 10, color: 'rgba(0,0,0,0.7)' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { width: '100%', backgroundColor: colors.surface, borderRadius: BORDER.radiusLg, padding: 24, ...SHADOWS.postIt },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: colors.textPrimary },
    modalBody: { gap: 16, marginBottom: 24 },
    inputGroup: { gap: 6 },
    inputLabel: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: colors.textSecondary },
    gradeInput: { borderWidth: 1, borderColor: colors.border, borderRadius: BORDER.radiusSm, padding: 12, fontFamily: FONTS.medium, fontSize: SIZES.md, color: colors.textPrimary },
    saveGradeBtn: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: BORDER.radiusSm, alignItems: 'center' },
    saveGradeBtnText: { color: '#FFFFFF', fontFamily: FONTS.bold, fontSize: SIZES.sm },
  });
}
