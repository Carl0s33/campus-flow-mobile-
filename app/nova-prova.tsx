import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampusStore } from '@/hooks/useCampusStore';
import { FONTS, SIZES, BORDER } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { ScreenHeader } from '@/components/ScreenHeader';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Layers, BookOpen } from 'lucide-react-native';

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

export default function NovaProvaScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const styles = makeStyles(colors, isDark);
  
  const addExam = useCampusStore(state => state.addExam);
  const disciplines = useCampusStore(state => state.disciplines);
  const fetchData = useCampusStore(state => state.fetchData);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [selectedPeriod, setSelectedPeriod] = useState<string | number>('all');
  const [title, setTitle] = useState('');
  const [disciplineId, setDisciplineId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [topics, setTopics] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredDisciplines = disciplines.filter(d => {
    if (selectedPeriod === 'all') return true;
    if (selectedPeriod === 0) return d.period === 0 || d.period === null || d.period === undefined;
    return d.period === selectedPeriod;
  });

  const handleSave = async () => {
    if (!title.trim() || !disciplineId || !date.trim() || !time.trim() || loading) return;

    setLoading(true);
    try {
      await addExam({
        title: title.trim(),
        disciplineId,
        date: date.trim(),
        time: time.trim(),
        topics: topics.trim() || undefined,
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

  const isFormValid = title.trim() && disciplineId && date.trim() && time.trim() && !loading;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScreenHeader title="Agendar Prova" />

        <ScrollView contentContainerStyle={styles.content}>
          <FormInput
            label="Título da Avaliação"
            placeholder="Ex: Prova 1 (P1)"
            value={title}
            onChangeText={setTitle}
          />

          {/* FILTRO POR PERÍODO */}
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
                      onPress={() => setDisciplineId(d.id)}
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

          <View style={styles.row}>
            <FormInput
              wrapperStyle={styles.flex}
              label="Data da Prova"
              placeholder="AAAA-MM-DD"
              value={date}
              onChangeText={setDate}
            />
            <FormInput
              wrapperStyle={styles.flex}
              label="Horário"
              placeholder="08:00"
              value={time}
              onChangeText={setTime}
            />
          </View>

          <FormInput
            label="Conteúdo / Tópicos (Opcional)"
            placeholder="Ex: Árvores Binárias, AVL e Grafos"
            value={topics}
            onChangeText={setTopics}
          />

          <PrimaryButton 
            title={loading ? "Salvando..." : "Salvar Prova"} 
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
  row: { flexDirection: 'row', gap: 16 },
});
