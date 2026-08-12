import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampusStore } from '../hooks/useCampusStore';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { Discipline } from '../types/campus';

export default function NovaDisciplinaScreen() {
  const router = useRouter();
  const addDiscipline = useCampusStore(state => state.addDiscipline);

  const [name, setName] = useState('');
  const [teacher, setTeacher] = useState('');
  const [color, setColor] = useState(COLORS.primaryLight);

  const handleSave = () => {
    if (!name.trim()) return;

    const newDiscipline: Discipline = {
      id: Date.now().toString(),
      name,
      teacher: teacher.trim() || undefined,
      color,
      absences: 0,
    };

    addDiscipline(newDiscipline);
    router.back();
  };

  const presetColors = [COLORS.primaryLight, COLORS.accentPurple, COLORS.accentGreen, COLORS.accentOrange, COLORS.accentRedLight, COLORS.accentGray];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nova Matéria</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome da Matéria</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Engenharia de Software"
              placeholderTextColor={COLORS.textTertiary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Professor (Opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Dr. Alan Turing"
              placeholderTextColor={COLORS.textTertiary}
              value={teacher}
              onChangeText={setTeacher}
            />
          </View>

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

          <TouchableOpacity style={[styles.saveBtn, !name.trim() && styles.saveBtnDisabled]} onPress={handleSave} disabled={!name.trim()}>
            <Text style={styles.saveBtnText}>Salvar Matéria</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  headerTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: COLORS.textPrimary },
  cancelText: { fontFamily: FONTS.medium, fontSize: SIZES.md, color: COLORS.textSecondary },
  content: { padding: 20, gap: 24 },
  formGroup: { gap: 8 },
  label: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.textPrimary },
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.borderLight, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontFamily: FONTS.regular, fontSize: SIZES.md, color: COLORS.textPrimary },
  colorRow: { flexDirection: 'row', gap: 12 },
  colorCircle: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'transparent' },
  colorCircleSelected: { borderColor: COLORS.primaryDark },
  saveBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.md, color: COLORS.surface },
});
