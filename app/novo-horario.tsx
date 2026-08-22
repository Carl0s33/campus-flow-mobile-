import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampusStore } from '@/hooks/useCampusStore';
import { FONTS, SIZES, BORDER } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { Schedule } from '@/types/campus';
import { ScreenHeader } from '@/components/ScreenHeader';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { BookOpen, Layers, GraduationCap, Info } from 'lucide-react-native';

const DAYS = [
  { label: 'Segunda', val: 1 },
  { label: 'Terça', val: 2 },
  { label: 'Quarta', val: 3 },
  { label: 'Quinta', val: 4 },
  { label: 'Sexta', val: 5 },
  { label: 'Sábado', val: 6 },
];

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

export default function NovoHorarioScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const styles = makeStyles(colors, isDark);
  
  const addSchedule = useCampusStore(state => state.addSchedule);
  const updateDiscipline = useCampusStore(state => state.updateDiscipline);
  const disciplines = useCampusStore(state => state.disciplines);
  const fetchData = useCampusStore(state => state.fetchData);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [selectedPeriod, setSelectedPeriod] = useState<string | number>('all');
  const [disciplineId, setDisciplineId] = useState('');
  const [teacher, setTeacher] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [room, setRoom] = useState('');
  const [loading, setLoading] = useState(false);

  // Filtragem de disciplinas por período
  const filteredDisciplines = disciplines.filter(d => {
    if (selectedPeriod === 'all') return true;
    if (selectedPeriod === 0) return d.period === 0 || d.period === null || d.period === undefined;
    return d.period === selectedPeriod;
  });

  const handleSelectDiscipline = (id: string) => {
    setDisciplineId(id);
    const chosen = disciplines.find(d => d.id === id);
    if (chosen) {
      setTeacher(chosen.teacher || '');
    }
  };

  const handleSave = async () => {
    if (!disciplineId || !startTime || !endTime || !room.trim() || loading) return;

    setLoading(true);
    try {
      // 1. Atualizar o professor da disciplina caso tenha sido informado ou alterado
      const chosen = disciplines.find(d => d.id === disciplineId);
      if (chosen && teacher.trim() !== (chosen.teacher || '')) {
        await updateDiscipline(disciplineId, { teacher: teacher.trim() || undefined });
      }

      // 2. Salvar o novo horário da aula
      await addSchedule({
        disciplineId,
        dayOfWeek,
        startTime,
        endTime,
        room: room.trim(),
      });

      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)/calendario');
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = disciplineId && startTime && endTime && room.trim() && !loading;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScreenHeader title="Adicionar Aula" />

        <ScrollView contentContainerStyle={styles.content}>
          {/* SELETOR DE PERÍODO */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Layers size={16} color={colors.primary} />
              <Text style={styles.label}>Filtrar por Período</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
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

          {/* SELEÇÃO DE DISCIPLINA */}
          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <BookOpen size={16} color={colors.primary} />
              <Text style={styles.label}>Disciplina ({filteredDisciplines.length} disponíveis)</Text>
            </View>
            {filteredDisciplines.length === 0 ? (
              <Text style={styles.hint}>Nenhuma matéria encontrada para este período.</Text>
            ) : (
              <View style={styles.chipsWrap}>
                {filteredDisciplines.map(d => {
                  const isSelected = disciplineId === d.id;
                  return (
                    <TouchableOpacity
                      key={d.id}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => handleSelectDiscipline(d.id)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.colorDot, { backgroundColor: d.color || colors.primary }]} />
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{d.name}</Text>
                      {d.code && <Text style={[styles.codeSubtext, isSelected && styles.codeSubtextActive]}>({d.code})</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* CAMPO DE PROFESSOR VINCULADO À MATÉRIA */}
          {disciplineId !== '' && (
            <View style={styles.teacherCard}>
              <View style={styles.teacherCardHeader}>
                <View style={styles.teacherIconBadge}>
                  <GraduationCap size={16} color={colors.primary} />
                </View>
                <View style={styles.teacherHeaderTextCol}>
                  <Text style={styles.teacherCardTitle}>Docente da Disciplina</Text>
                  <Text style={styles.teacherCardSubtitle}>Vincule ou altere o professor desta matéria</Text>
                </View>
              </View>

              <FormInput
                label="Nome do Professor"
                placeholder="Ex: Prof. Dr. Leandro Luttiane"
                value={teacher}
                onChangeText={setTeacher}
              />

              <View style={styles.teacherHintRow}>
                <Info size={13} color={colors.textTertiary} />
                <Text style={styles.teacherHintText}>
                  Salvo automaticamente no perfil da matéria no banco de dados.
                </Text>
              </View>
            </View>
          )}

          {/* DIA DA SEMANA */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Dia da Semana</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {DAYS.map(day => (
                <TouchableOpacity
                  key={day.val}
                  style={[styles.chip, dayOfWeek === day.val && styles.chipActive]}
                  onPress={() => setDayOfWeek(day.val)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, dayOfWeek === day.val && styles.chipTextActive]}>{day.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* HORÁRIOS */}
          <View style={styles.row}>
            <FormInput
              wrapperStyle={styles.flex}
              label="Início"
              placeholder="08:00"
              value={startTime}
              onChangeText={setStartTime}
            />
            <FormInput
              wrapperStyle={styles.flex}
              label="Fim"
              placeholder="09:40"
              value={endTime}
              onChangeText={setEndTime}
            />
          </View>

          {/* SALA / BLOCO */}
          <FormInput
            label="Sala / Bloco"
            placeholder="Ex: Lab 04 - Bloco B"
            value={room}
            onChangeText={setRoom}
          />

          <PrimaryButton 
            title={loading ? "Salvando..." : "Salvar Horário"} 
            onPress={handleSave} 
            disabled={!isFormValid} 
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 20 },
  formGroup: { gap: 8 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: colors.textPrimary },
  horizontalScroll: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingVertical: 4 },
  hint: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: colors.textTertiary, paddingVertical: 8 },
  periodChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: isDark ? StyleSheet.hairlineWidth : 0,
    borderColor: colors.border,
    backgroundColor: colors.surface,
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
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: isDark ? StyleSheet.hairlineWidth : 0,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 6,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: colors.textPrimary,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontFamily: FONTS.bold,
  },
  codeSubtext: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: colors.textTertiary,
  },
  codeSubtextActive: {
    color: 'rgba(255,255,255,0.8)',
  },
  teacherCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 24,
    borderWidth: isDark ? StyleSheet.hairlineWidth : 0,
    borderColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
    gap: 12,
  },
  teacherCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  teacherIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teacherHeaderTextCol: {
    flex: 1,
  },
  teacherCardTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.sm,
    color: colors.textPrimary,
  },
  teacherCardSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  teacherHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 2,
  },
  teacherHintText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: colors.textTertiary,
    flex: 1,
  },
  row: { flexDirection: 'row', gap: 16 },
});
