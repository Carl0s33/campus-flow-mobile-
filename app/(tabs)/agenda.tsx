import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampusStore } from '../../hooks/useCampusStore';
import TopAppBar from '../../src/components/TopAppBar';
import { MATTE_COLORS, FONTS, SIZES, BORDER, SHADOWS } from '../../constants/theme';
import { useTheme } from '../../src/hooks/useTheme';
import { Clock, Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react-native';

export default function AgendaScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const tasks = useCampusStore(state => state.tasks);
  const disciplines = useCampusStore(state => state.disciplines);
  const toggleTask = useCampusStore(state => state.toggleTask);
  const removeTask = useCampusStore(state => state.removeTask);

  const [filterType, setFilterType] = useState<'todos' | 'trabalho' | 'atividade'>('todos');

  const filteredTasks = tasks.filter(t => {
    if (filterType === 'todos') return true;
    return t.type === filterType;
  });

  const pendingTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);
  const thisWeekTasks = pendingTasks.slice(0, 3);
  const laterTasks = pendingTasks.slice(3);

  const handleDeleteTask = (id: string, title: string) => {
    Alert.alert(
      'Remover Tarefa',
      `Deseja realmente remover a tarefa "${title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => removeTask(id) },
      ]
    );
  };

  const styles = makeStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <TopAppBar title="Minha Agenda" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Prazos & Tarefas</Text>
          <TouchableOpacity onPress={() => router.push('/nova-tarefa')} style={styles.addButton} activeOpacity={0.8}>
            <Plus size={18} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Nova Tarefa</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(['todos', 'trabalho', 'atividade'] as const).map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.filterChip, filterType === type && styles.filterChipActive]}
              onPress={() => setFilterType(type)}
            >
              <Text style={[styles.filterChipText, filterType === type && styles.filterChipTextActive]}>
                {type === 'todos' ? `Todas (${tasks.length})` : type === 'trabalho' ? 'Trabalhos' : 'Atividades'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ESTA SEMANA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Esta Semana</Text>
          {thisWeekTasks.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Nenhum prazo pendente nesta categoria para esta semana.</Text>
            </View>
          ) : (
            thisWeekTasks.map((task, idx) => {
              const disc = disciplines.find(d => d.id === task.disciplineId);
              const matteColor = disc?.color || MATTE_COLORS[idx % MATTE_COLORS.length];
              return (
                <View key={task.id} style={[styles.taskMatteCard, { backgroundColor: matteColor }]}>
                  <TouchableOpacity onPress={() => toggleTask(task.id)} style={styles.checkboxTouch}>
                    <Circle size={22} color="#111827" />
                  </TouchableOpacity>
                  <View style={styles.taskMainInfo}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <View style={styles.subjectTag}>
                      <Text style={styles.subjectTagText}>{disc?.code || 'Geral'}</Text>
                    </View>
                  </View>
                  <View style={styles.rightActionCol}>
                    <View style={styles.dueCol}>
                      <Clock size={13} color="#EF4444" />
                      <Text style={styles.dueDateUrgent}>{task.dueDate}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteTask(task.id, task.title)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Trash2 size={14} color="rgba(0,0,0,0.35)" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* MAIS TARDE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mais Tarde</Text>
          {laterTasks.length === 0 && pendingTasks.length <= 3 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Nenhum prazo futuro agendado por enquanto.</Text>
            </View>
          ) : (
            laterTasks.map((task, idx) => {
              const disc = disciplines.find(d => d.id === task.disciplineId);
              const matteColor = disc?.color || MATTE_COLORS[(idx + 2) % MATTE_COLORS.length];
              return (
                <View key={task.id} style={[styles.taskMatteCard, { backgroundColor: matteColor }]}>
                  <TouchableOpacity onPress={() => toggleTask(task.id)} style={styles.checkboxTouch}>
                    <Circle size={22} color="#111827" />
                  </TouchableOpacity>
                  <View style={styles.taskMainInfo}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <View style={styles.subjectTag}>
                      <Text style={styles.subjectTagText}>{disc?.code || 'Geral'}</Text>
                    </View>
                  </View>
                  <View style={styles.rightActionCol}>
                    <View style={styles.dueCol}>
                      <Clock size={13} color="#374151" />
                      <Text style={styles.dueDateNormal}>{task.dueDate}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteTask(task.id, task.title)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Trash2 size={14} color="rgba(0,0,0,0.35)" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* CONCLUÍDAS */}
        {completedTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Concluídas ({completedTasks.length})</Text>
            {completedTasks.map((task) => (
              <View key={task.id} style={[styles.taskMatteCard, styles.completedCard]}>
                <TouchableOpacity onPress={() => toggleTask(task.id)}>
                  <CheckCircle2 size={22} color={colors.success} />
                </TouchableOpacity>
                <View style={styles.taskMainInfo}>
                  <Text style={[styles.taskTitle, styles.completedText]}>{task.title}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteTask(task.id, task.title)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Trash2 size={14} color={colors.textTertiary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { padding: 24, paddingBottom: 110 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    pageTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: colors.textPrimary },
    addButton: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 10,
      borderRadius: BORDER.radiusSm, ...SHADOWS.postIt,
    },
    addButtonText: { fontFamily: FONTS.bold, fontSize: SIZES.xs, color: '#FFFFFF' },
    filterRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
    filterChip: {
      paddingHorizontal: 14, paddingVertical: 7, borderRadius: 9999,
      backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    },
    filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    filterChipText: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs, color: colors.textSecondary },
    filterChipTextActive: { color: '#FFFFFF' },
    section: { marginBottom: 28 },
    sectionTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: colors.textPrimary, marginBottom: 12 },
    taskMatteCard: {
      flexDirection: 'row', alignItems: 'center', borderRadius: BORDER.radiusLg,
      padding: 16, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
      gap: 12, ...SHADOWS.postIt,
    },
    checkboxTouch: { padding: 2 },
    taskMainInfo: { flex: 1, gap: 4 },
    taskTitle: { fontFamily: FONTS.bold, fontSize: SIZES.md, color: '#111827' },
    subjectTag: {
      alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.08)',
      paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999,
    },
    subjectTagText: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs, color: '#374151' },
    rightActionCol: { alignItems: 'flex-end', gap: 8 },
    dueCol: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    dueDateUrgent: { fontFamily: FONTS.bold, fontSize: SIZES.xs, color: '#EF4444' },
    dueDateNormal: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: '#374151' },
    completedCard: { backgroundColor: colors.surface, opacity: 0.65 },
    completedText: { textDecorationLine: 'line-through', color: colors.textSecondary },
    emptyCard: {
      backgroundColor: colors.surface, borderRadius: BORDER.radiusLg,
      padding: 16, borderWidth: 1, borderColor: colors.border, ...SHADOWS.light,
    },
    emptyText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: colors.textSecondary },
  });
}
