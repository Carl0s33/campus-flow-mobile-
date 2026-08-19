import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampusStore } from '@/hooks/useCampusStore';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { Schedule } from '@/types/campus';
import { ScreenHeader } from '@/components/ScreenHeader';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';

const DAYS = [
  { label: 'Segunda', val: 1 },
  { label: 'Terça', val: 2 },
  { label: 'Quarta', val: 3 },
  { label: 'Quinta', val: 4 },
  { label: 'Sexta', val: 5 },
  { label: 'Sábado', val: 6 },
];

export default function NovoHorarioScreen() {
  const router = useRouter();
  const addSchedule = useCampusStore(state => state.addSchedule);
  const disciplines = useCampusStore(state => state.disciplines);

  const [disciplineId, setDisciplineId] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [room, setRoom] = useState('');

  const handleSave = () => {
    if (!disciplineId || !startTime || !endTime || !room.trim()) return;

    const newSchedule: Schedule = {
      id: Date.now().toString(),
      disciplineId,
      dayOfWeek,
      startTime,
      endTime,
      room: room.trim(),
    };

    addSchedule(newSchedule);
    router.back();
  };

  const isFormValid = disciplineId && startTime && endTime && room.trim();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScreenHeader title="Adicionar Aula" />

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Disciplina</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {disciplines.length === 0 && <Text style={styles.hint}>Nenhuma matéria cadastrada.</Text>}
              {disciplines.map(d => (
                <TouchableOpacity
                  key={d.id}
                  style={[styles.chip, disciplineId === d.id && styles.chipActive]}
                  onPress={() => setDisciplineId(d.id)}
                >
                  <Text style={[styles.chipText, disciplineId === d.id && styles.chipTextActive]}>{d.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Dia da Semana</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {DAYS.map(day => (
                <TouchableOpacity
                  key={day.val}
                  style={[styles.chip, dayOfWeek === day.val && styles.chipActive]}
                  onPress={() => setDayOfWeek(day.val)}
                >
                  <Text style={[styles.chipText, dayOfWeek === day.val && styles.chipTextActive]}>{day.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

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

          <FormInput
            label="Sala / Bloco"
            placeholder="Ex: Prédio 4, Sala 201"
            value={room}
            onChangeText={setRoom}
          />

          <PrimaryButton 
            title="Salvar Horário" 
            onPress={handleSave} 
            disabled={!isFormValid} 
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, gap: 24 },
  formGroup: { gap: 8 },
  row: { flexDirection: 'row', gap: 16 },
  label: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.textPrimary },
  horizontalScroll: { gap: 8 },
  hint: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textTertiary },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.surface },
});
