import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampusStore } from '@/hooks/useCampusStore';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { Discipline } from '@/types/campus';
import { ScreenHeader } from '@/components/ScreenHeader';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function NovaDisciplinaScreen() {
  const router = useRouter();
  const addDiscipline = useCampusStore(state => state.addDiscipline);

  const [name, setName] = useState('');
  const [teacher, setTeacher] = useState('');
  const [workload, setWorkload] = useState('');
  const [color, setColor] = useState(COLORS.primaryLight);

  const handleSave = () => {
    if (!name.trim()) return;

    const newDiscipline: Discipline = {
      id: Date.now().toString(),
      name,
      teacher: teacher.trim() || undefined,
      color,
      absences: 0,
      workload: Number(workload) || 60,
    };

    addDiscipline(newDiscipline);
    router.back();
  };

  const presetColors = [COLORS.primaryLight, COLORS.accentPurple, COLORS.accentGreen, COLORS.accentOrange, COLORS.accentRedLight, COLORS.accentGray];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScreenHeader title="Nova Matéria" />

        <ScrollView contentContainerStyle={styles.content}>
          <FormInput
            label="Nome da Matéria"
            placeholder="Ex: Engenharia de Software"
            value={name}
            onChangeText={setName}
          />

          <FormInput
            label="Professor (Opcional)"
            placeholder="Ex: Dr. Alan Turing"
            value={teacher}
            onChangeText={setTeacher}
          />

          <FormInput
            label="Carga Horária (horas)"
            placeholder="Ex: 60"
            value={workload}
            onChangeText={setWorkload}
            keyboardType="numeric"
          />

          <View style={styles.formGroup}>
            <Text style={styles.label}>Cor Temática</Text>
            <View style={styles.colorRow}>
              {presetColors.map(c => (
                <TouchableOpacity 
                  key={c}
                  style={[styles.colorCircle, { backgroundColor: c }, color === c && styles.colorCircleSelected]}
                  onPress={() => setColor(c)}
                />
              ))}
            </View>
          </View>

          <PrimaryButton 
            title="Salvar Matéria" 
            onPress={handleSave} 
            disabled={!name.trim()} 
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
  label: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.textPrimary },
  colorRow: { flexDirection: 'row', gap: 12 },
  colorCircle: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'transparent' },
  colorCircleSelected: { borderColor: COLORS.primaryDark },
});
