import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampusStore } from '@/hooks/useCampusStore';
import TopAppBar from '@/components/TopAppBar';
import { MATTE_COLORS, FONTS, SIZES, BORDER, SHADOWS, getContrastTextColor } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { Plus, BookOpen, Code, Cpu, Calculator, Compass, Atom, Trash2, AlertTriangle, GraduationCap, X } from 'lucide-react-native';
import { scheduleAbsenceWarning } from '@/hooks/useNotifications';
import PomodoroModal from '@/components/PomodoroModal';

const SUBJECT_ICONS = [Code, BookOpen, Calculator, Cpu, Compass, Atom];

const PERIOD_FILTERS: { id: string | number; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 1, label: '1º Período' },
  { id: 2, label: '2º Período' },
  { id: 3, label: '3º Período' },
  { id: 4, label: '4º Período' },
  { id: 5, label: '5º Período' },
  { id: 6, label: '6º Período' },
  { id: 7, label: '7º Período' },
  { id: 0, label: 'Optativas' },
];

export default function DisciplinasScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const disciplines = useCampusStore(state => state.disciplines);
  const incrementAbsence = useCampusStore(state => state.incrementAbsence);
  const decrementAbsence = useCampusStore(state => state.decrementAbsence);
  const removeDiscipline = useCampusStore(state => state.removeDiscipline);
  const updateDiscipline = useCampusStore(state => state.updateDiscipline);
  const setGrade = useCampusStore(state => state.setGrade);
  const fetchData = useCampusStore(state => state.fetchData);

  const [selectedPeriod, setSelectedPeriod] = useState<string | number>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [gradeModalVisible, setGradeModalVisible] = useState(false);
  const [editingDiscipline, setEditingDiscipline] = useState<string | null>(null);
  const [teacherInput, setTeacherInput] = useState('');
  const [n1Input, setN1Input] = useState('');
  const [n2Input, setN2Input] = useState('');
  const [recoveryInput, setRecoveryInput] = useState('');
  
  const [pomodoroModalVisible, setPomodoroModalVisible] = useState(false);
  const [pomodoroSubject, setPomodoroSubject] = useState<{ id: string; name: string } | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const filteredDisciplines = disciplines.filter(d => {
    if (selectedPeriod === 'all') return true;
    if (selectedPeriod === 0) return d.period === 0 || d.period === null || d.period === undefined;
    return d.period === selectedPeriod;
  });

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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Minhas Matérias</Text>
            <Text style={styles.pageSubtitle}>{disciplines.length} disciplinas cadastradas</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/nova-disciplina')} activeOpacity={0.8}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* SELETOR DE PERÍODO */}
        <View style={styles.periodFilterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.periodScroll}>
            {PERIOD_FILTERS.map(period => (
              <TouchableOpacity
                key={String(period.id)}
                style={[styles.periodChip, selectedPeriod === period.id && styles.periodChipActive]}
                onPress={() => setSelectedPeriod(period.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.periodChipText, selectedPeriod === period.id && styles.periodChipTextActive]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {filteredDisciplines.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Nenhuma matéria neste período</Text>
            <Text style={styles.emptyText}>Cadastre suas matérias para organizar seus horários e faltas.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/nova-disciplina')}>
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.emptyBtnText}>Cadastrar Primeira Matéria</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {filteredDisciplines.map((subject, idx) => {
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
                    
                    {/* Pomodoro Solto */}
                    <TouchableOpacity 
                      style={[styles.pomodoroBtn, { backgroundColor: 'rgba(0,0,0,0.1)' }]}
                      onPress={() => {
                        setPomodoroSubject({ id: subject.id, name: subject.name });
                        setPomodoroModalVisible(true);
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Atom size={12} color={cardTextColor} />
                        <Text style={[styles.pomodoroBtnText, { color: cardTextColor }]}>
                          Foco: {subject.pomodoroCount || 0} ciclos
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={[styles.absenceRow, isWarning && styles.absenceRowWarning]}>
                    <View style={styles.absenceInfo}>
                      {isWarning && <AlertTriangle size={12} color="#EF4444" />}
                      <Text style={[styles.absenceCount, { color: cardTextColor }, isWarning && styles.absenceCountWarning]}>
                        Faltas: {subject.absences} / {maxAbsences} ({Math.round((subject.absences/maxAbsences)*100)}%)
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
                    <Text style={[styles.gradesStatus, { color: subject.statusColor || '#6B7280' }]}>
                      {subject.statusText || 'Sem notas lançadas'}
                    </Text>
                    <TouchableOpacity
                      style={styles.addGradeBtn}
                      onPress={() => {
                        setEditingDiscipline(subject.id);
                        setTeacherInput(subject.teacher || '');
                        setN1Input(subject.grades?.n1 !== undefined ? String(subject.grades.n1) : '');
                        setN2Input(subject.grades?.n2 !== undefined ? String(subject.grades.n2) : '');
                        setRecoveryInput(subject.grades?.recoveryGrade !== undefined ? String(subject.grades.recoveryGrade) : '');
                        setGradeModalVisible(true);
                      }}
                    >
                      <Text style={styles.addGradeBtnText}>Editar Docente / Notas</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* MODAL DE DOCENTE E NOTAS */}
      <Modal visible={gradeModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Docente & Notas</Text>
              <TouchableOpacity onPress={() => setGradeModalVisible(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Professor / Docente</Text>
                <TextInput
                  style={styles.gradeInput}
                  value={teacherInput}
                  onChangeText={setTeacherInput}
                  placeholder="Ex: Prof. Dr. Alan Turing"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

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

              {/* Show recovery input only if N1 and N2 are present and average < 6 */}
              {n1Input && n2Input && ((parseFloat(n1Input.replace(',','.')) * 2 + parseFloat(n2Input.replace(',','.')) * 3) / 5) < 6 && (
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: '#F59E0B' }]}>Prova Final (Recuperação)</Text>
                  <TextInput
                    style={[styles.gradeInput, { borderColor: '#F59E0B' }]}
                    keyboardType="numeric"
                    value={recoveryInput}
                    onChangeText={setRecoveryInput}
                    placeholder="0.0 a 10.0"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.saveGradeBtn}
              onPress={async () => {
                if (editingDiscipline) {
                  const val1 = n1Input ? parseFloat(n1Input.replace(',', '.')) : undefined;
                  const val2 = n2Input ? parseFloat(n2Input.replace(',', '.')) : undefined;
                  const valRec = recoveryInput ? parseFloat(recoveryInput.replace(',', '.')) : undefined;
                  await setGrade(editingDiscipline, isNaN(val1!) ? undefined : val1, isNaN(val2!) ? undefined : val2, isNaN(valRec!) ? undefined : valRec);
                  await updateDiscipline(editingDiscipline, { teacher: teacherInput.trim() || undefined });
                }
                setGradeModalVisible(false);
              }}
            >
              <Text style={styles.saveGradeBtnText}>Salvar Informações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL DE POMODORO SOLTO */}
      <PomodoroModal 
        visible={pomodoroModalVisible}
        onClose={() => setPomodoroModalVisible(false)}
        taskTitle={pomodoroSubject?.name || 'Disciplina'}
        disciplineId={pomodoroSubject?.id}
      />
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
    periodFilterContainer: { marginBottom: 18 },
    periodScroll: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
    periodChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: BORDER.radiusSm,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      ...SHADOWS.light,
    },
    periodChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    periodChipText: {
      fontFamily: FONTS.medium,
      fontSize: SIZES.xs,
      color: colors.textSecondary,
    },
    periodChipTextActive: {
      color: '#FFFFFF',
      fontFamily: FONTS.bold,
    },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16 },
    squareCard: {
      width: '48%', borderRadius: 16, padding: 12,
      borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.08)', ...SHADOWS.postIt,
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
    codeText: { fontFamily: FONTS.bold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, opacity: 0.7 },
    subjectTitle: { fontFamily: FONTS.bold, fontSize: 13, lineHeight: 16 },
    professorText: { fontFamily: FONTS.semiBold, fontSize: 10, opacity: 0.8 },
    pomodoroBtn: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4, marginTop: 4 },
    pomodoroBtnText: { fontFamily: FONTS.bold, fontSize: 10 },
    absenceRow: {
      flexDirection: 'column', alignItems: 'flex-start', gap: 6,
      backgroundColor: 'rgba(0,0,0,0.07)', padding: 8, borderRadius: BORDER.radiusSm,
      marginTop: 8
    },
    absenceRowWarning: { backgroundColor: 'rgba(239,68,68,0.15)' },
    absenceInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    absenceCount: { fontFamily: FONTS.bold, fontSize: 10 },
    absenceCountWarning: { color: '#EF4444' },
    absenceActions: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'stretch', justifyContent: 'space-between' },
    absenceMinusBtn: { backgroundColor: 'rgba(0,0,0,0.12)', height: 24, width: 28, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
    absenceBtn: { backgroundColor: 'rgba(0,0,0,0.12)', paddingVertical: 4, borderRadius: 4, flex: 1, alignItems: 'center', justifyContent: 'center' },
    absenceBtnWarning: { backgroundColor: '#EF4444' },
    absenceBtnText: { fontFamily: FONTS.bold, fontSize: 10 },
    absenceBtnTextWarning: { color: '#FFFFFF' },
    emptyContainer: {
      backgroundColor: colors.surface, borderRadius: 16, padding: 24,
      borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, alignItems: 'center', gap: 12, ...SHADOWS.postIt,
    },
    emptyTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: colors.textPrimary },
    emptyText: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: colors.textSecondary, textAlign: 'center' },
    emptyBtn: {
      backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 18,
      borderRadius: BORDER.radiusSm, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4,
    },
    emptyBtnText: { color: '#FFFFFF', fontFamily: FONTS.bold, fontSize: SIZES.sm },
    gradesRow: { marginTop: 8, backgroundColor: 'rgba(0,0,0,0.04)', padding: 8, borderRadius: BORDER.radiusSm },
    gradesHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
    gradesTitle: { fontFamily: FONTS.bold, fontSize: 9, textTransform: 'uppercase' },
    gradesStatus: { fontFamily: FONTS.bold, fontSize: 11, marginBottom: 8 },
    addGradeBtn: { backgroundColor: 'rgba(0,0,0,0.08)', paddingVertical: 6, borderRadius: 4, alignItems: 'center' },
    addGradeBtnText: { fontFamily: FONTS.semiBold, fontSize: 9, color: 'rgba(0,0,0,0.7)' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { width: '100%', backgroundColor: colors.surface, borderRadius: 24, padding: 24, ...SHADOWS.postIt },
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
