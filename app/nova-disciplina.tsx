import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampusStore } from '@/hooks/useCampusStore';
import { FONTS, SIZES, MATTE_COLORS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { ScreenHeader } from '@/components/ScreenHeader';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function NovaDisciplinaScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const styles = makeStyles(colors);
  
  const addDiscipline = useCampusStore(state => state.addDiscipline);

  const [name, setName] = useState('');
  const [teacher, setTeacher] = useState('');
  const [workload, setWorkload] = useState('');
  const presetColors = MATTE_COLORS;
  const [color, setColor] = useState(presetColors[0]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || loading) return;

    setLoading(true);
    try {
      await addDiscipline({
        name: name.trim(),
        teacher: teacher.trim() || undefined,
        color,
        absences: 0,
        workload: Number(workload) || 60,
      });
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)/disciplinas');
      }
    } finally {
      setLoading(false);
    }
  };

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
            title={loading ? "Salvando..." : "Salvar Matéria"} 
            onPress={handleSave} 
            disabled={!name.trim() || loading} 
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(colors: any) {
  return StyleSheet.create({
    flex: { flex: 1 },
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 20, gap: 24 },
    formGroup: { gap: 8 },
    label: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: colors.textPrimary },
    colorRow: { flexDirection: 'row', gap: 12 },
    colorCircle: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'transparent' },
    colorCircleSelected: { borderColor: colors.primaryDark },
  });
}
