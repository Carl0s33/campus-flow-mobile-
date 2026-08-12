import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampusStore } from '../hooks/useCampusStore';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { Task } from '../types/campus';

export default function NovaTarefaScreen() {
  const router = useRouter();
  const addTask = useCampusStore(state => state.addTask);
  const disciplines = useCampusStore(state => state.disciplines);

  const [title, setTitle] = useState('');
  const [disciplineId, setDisciplineId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState<'trabalho' | 'atividade'>('atividade');

  const handleSave = () => {
    if (!title.trim() || !disciplineId || !dueDate.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      disciplineId,
      dueDate: dueDate.trim(),
      completed: false,
      type,
    };

    addTask(newTask);
    router.back();
  };

  const isFormValid = title.trim() && disciplineId && dueDate.trim();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Adicionar Tarefa</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Título da Tarefa</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Lista de Exercícios 3"
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

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo de Tarefa</Text>
            <View style={styles.horizontalScroll}>
              <TouchableOpacity
                style={[styles.chip, type === 'atividade' && styles.chipActive]}
                onPress={() => setType('atividade')}
              >
                <Text style={[styles.chipText, type === 'atividade' && styles.chipTextActive]}>Atividade</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chip, type === 'trabalho' && styles.chipActive]}
                onPress={() => setType('trabalho')}
              >
                <Text style={[styles.chipText, type === 'trabalho' && styles.chipTextActive]}>Trabalho</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Data de Vencimento</Text>
            <TextInput
              style={styles.input}
              placeholder="AAAA-MM-DD"
              placeholderTextColor={COLORS.textTertiary}
              value={dueDate}
              onChangeText={setDueDate}
            />
          </View>

          <TouchableOpacity style={[styles.saveBtn, !isFormValid && styles.saveBtnDisabled]} onPress={handleSave} disabled={!isFormValid}>
            <Text style={styles.saveBtnText}>Salvar Tarefa</Text>
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
  horizontalScroll: { flexDirection: 'row', gap: 8 },
  hint: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textTertiary },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.surface },
  saveBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.md, color: COLORS.surface },
});
