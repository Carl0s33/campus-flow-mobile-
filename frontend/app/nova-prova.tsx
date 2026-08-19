import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampusStore } from '@/hooks/useCampusStore';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { Exam } from '@/types/campus';

export default function NovaProvaScreen() {
  const router = useRouter();
  const addExam = useCampusStore(state => state.addExam);
  const disciplines = useCampusStore(state => state.disciplines);

  const [title, setTitle] = useState('');
  const [disciplineId, setDisciplineId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [topics, setTopics] = useState('');

  const handleSave = () => {
    if (!title.trim() || !disciplineId || !date.trim() || !time.trim()) return;

    const newExam: Exam = {
      id: Date.now().toString(),
      title: title.trim(),
      disciplineId,
      date: date.trim(),
      time: time.trim(),
      topics: topics.trim() || undefined,
    };

    addExam(newExam);
    router.back();
  };

  const isFormValid = title.trim() && disciplineId && date.trim() && time.trim();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Agendar Prova</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Título da Prova</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: P1"
              placeholderTextColor={COLORS.textTertiary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

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

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.flex]}>
              <Text style={styles.label}>Data</Text>
              <TextInput
                style={styles.input}
                placeholder="AAAA-MM-DD"
                placeholderTextColor={COLORS.textTertiary}
                value={date}
                onChangeText={setDate}
              />
            </View>
            <View style={[styles.formGroup, styles.flex]}>
              <Text style={styles.label}>Horário</Text>
              <TextInput
                style={styles.input}
                placeholder="08:00"
                placeholderTextColor={COLORS.textTertiary}
                value={time}
                onChangeText={setTime}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Assuntos / Conteúdo (Opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva o conteúdo que cairá na prova..."
              placeholderTextColor={COLORS.textTertiary}
              value={topics}
              onChangeText={setTopics}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={[styles.saveBtn, !isFormValid && styles.saveBtnDisabled]} onPress={handleSave} disabled={!isFormValid}>
            <Text style={styles.saveBtnText}>Salvar Prova</Text>
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
  row: { flexDirection: 'row', gap: 16 },
  label: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.textPrimary },
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.borderLight, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontFamily: FONTS.regular, fontSize: SIZES.md, color: COLORS.textPrimary },
  textArea: { height: 100 },
  horizontalScroll: { gap: 8 },
  hint: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textTertiary },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.surface },
  saveBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.md, color: COLORS.surface },
});
