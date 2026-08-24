import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampusStore } from '@/hooks/useCampusStore';
import TopAppBar from '@/components/TopAppBar';
import { MATTE_COLORS, FONTS, SIZES, BORDER, SHADOWS, getContrastTextColor } from '@/constants/theme';
import { Swipeable } from 'react-native-gesture-handler';
import { useTheme } from '@/hooks/useTheme';
import { Clock, Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react-native';
import { formatDueDate, isDueToday } from '@/utils/dateHelpers';
import PomodoroModal from '@/components/PomodoroModal';
import { Play } from 'lucide-react-native';

const FILTER_OPTIONS: { key: 'todos' | 'trabalho' | 'atividade'; label: string }[] = [
  { key: 'todos', label: 'Todas' },
  { key: 'trabalho', label: 'Trabalhos' },
  { key: 'atividade', label: 'Atividades' },
];

export default function AgendaScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const tasks = useCampusStore(state => state.tasks);
  const disciplines = useCampusStore(state => state.disciplines);
  const toggleTask = useCampusStore(state => state.toggleTask);
  const removeTask = useCampusStore(state => state.removeTask);
  const fetchData = useCampusStore(state => state.fetchData);

  const [refreshing, setRefreshing] = useState(false);
  const [pomodoroVisible, setPomodoroVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{ id: string; title: string } | null>(null);

  const [filterType, setFilterType] = useState<'todos' | 'trabalho' | 'atividade'>('todos');

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const filteredTasks = tasks.filter(t => {
    if (filterType === 'todos') return true;
    return t.type === filterType;
  });

  const pendingTasks = filteredTasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const completedTasks = filteredTasks
    .filter(t => t.completed)
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
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

  const handleOpenPomodoro = (id: string, title: string) => {
    setSelectedTask({ id, title });
    setPomodoroVisible(true);
  };

  const renderLeftActions = (id: string) => (
    <View style={styles.leftAction}>
      <CheckCircle2 size={24} color="#FFFFFF" />
      <Text style={styles.actionText}>Concluir</Text>
    </View>
  );

  const renderRightActions = (id: string, title: string) => (
    <TouchableOpacity style={styles.rightAction} onPress={() => handleDeleteTask(id, title)}>
      <Trash2 size={24} color="#FFFFFF" />
      <Text style={styles.actionText}>Remover</Text>
    </TouchableOpacity>
  );

  const getFilterCount = (type: string) => {
    if (type === 'todos') return tasks.length;
    return tasks.filter(t => t.type === type).length;
  };

  const styles = makeStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <TopAppBar title="Minha Agenda" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Prazos & Tarefas</Text>
          <TouchableOpacity onPress={() => router.push('/nova-tarefa')} style={styles.addButton} activeOpacity={0.8}>
            <Plus size={18} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Nova Tarefa</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {FILTER_OPTIONS.map(opt => {
            const count = getFilterCount(opt.key);
            const countText = `${opt.label} (${count})`;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.filterChip, filterType === opt.key && styles.filterChipActive]}
                onPress={() => setFilterType(opt.key)}
              >
                <Text style={[styles.filterChipText, filterType === opt.key && styles.filterChipTextActive]}>
                  {countText}
                </Text>
              </TouchableOpacity>
            );
          })}
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
              const cardTextColor = getContrastTextColor(matteColor);
              return (
                <Swipeable
                  key={task.id}
                  renderLeftActions={() => renderLeftActions(task.id)}
                  renderRightActions={() => renderRightActions(task.id, task.title)}
                  onSwipeableLeftOpen={() => toggleTask(task.id)}
                >
                  <TouchableOpacity activeOpacity={0.9} onPress={() => toggleTask(task.id)} style={[styles.taskMatteCard, { backgroundColor: matteColor }]}>
                    <TouchableOpacity onPress={(e) => { e.stopPropagation(); toggleTask(task.id); }} style={styles.checkboxTouch}>
                      <Circle size={22} color={cardTextColor} />
                    </TouchableOpacity>
                    <View style={styles.taskMainInfo}>
                      <Text style={[styles.taskTitle, { color: cardTextColor }]}>{task.title}</Text>
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        <View style={[styles.subjectTag, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
                          <Text style={[styles.subjectTagText, { color: cardTextColor }]}>{disc?.code || 'Geral'}</Text>
                        </View>
                        {task.pomodoroCount !== undefined && task.pomodoroCount > 0 && (
                          <View style={[styles.subjectTag, { backgroundColor: 'rgba(0,0,0,0.15)' }]}>
                            <Text style={[styles.subjectTagText, { color: cardTextColor }]}>{task.pomodoroCount} ciclos</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={styles.rightActionCol}>
                      <View style={styles.dueCol}>
                        <Clock size={13} color={isDueToday(task.dueDate) ? "#EF4444" : cardTextColor} />
                        <Text style={isDueToday(task.dueDate) ? styles.dueDateUrgent : [styles.dueDateNormal, { color: cardTextColor }]}>
                          {formatDueDate(task.dueDate)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.pomodoroPlayBtn, { backgroundColor: 'rgba(0,0,0,0.1)' }]}
                        onPress={(e) => { e.stopPropagation(); handleOpenPomodoro(task.id, task.title); }}
                        activeOpacity={0.8}
                      >
                        <Play size={14} color={cardTextColor} fill={cardTextColor} />
                        <Text style={[styles.pomodoroPlayBtnText, { color: cardTextColor }]}>Foco</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Swipeable>
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
              const cardTextColor = getContrastTextColor(matteColor);
              return (
                <Swipeable
                  key={task.id}
                  renderLeftActions={() => renderLeftActions(task.id)}
                  renderRightActions={() => renderRightActions(task.id, task.title)}
                  onSwipeableLeftOpen={() => toggleTask(task.id)}
                >
                  <TouchableOpacity activeOpacity={0.9} onPress={() => toggleTask(task.id)} style={[styles.taskMatteCard, { backgroundColor: matteColor }]}>
                    <TouchableOpacity onPress={(e) => { e.stopPropagation(); toggleTask(task.id); }} style={styles.checkboxTouch}>
                      <Circle size={22} color={cardTextColor} />
                    </TouchableOpacity>
                    <View style={styles.taskMainInfo}>
                      <Text style={[styles.taskTitle, { color: cardTextColor }]}>{task.title}</Text>
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        <View style={[styles.subjectTag, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
                          <Text style={[styles.subjectTagText, { color: cardTextColor }]}>{disc?.code || 'Geral'}</Text>
                        </View>
                        {task.pomodoroCount !== undefined && task.pomodoroCount > 0 && (
                          <View style={[styles.subjectTag, { backgroundColor: 'rgba(0,0,0,0.15)' }]}>
                            <Text style={[styles.subjectTagText, { color: cardTextColor }]}>{task.pomodoroCount} ciclos</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={styles.rightActionCol}>
                      <View style={styles.dueCol}>
                        <Clock size={13} color={isDueToday(task.dueDate) ? "#EF4444" : cardTextColor} />
                        <Text style={isDueToday(task.dueDate) ? styles.dueDateUrgent : [styles.dueDateNormal, { color: cardTextColor }]}>
                          {formatDueDate(task.dueDate)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.pomodoroPlayBtn, { backgroundColor: 'rgba(0,0,0,0.1)' }]}
                        onPress={(e) => { e.stopPropagation(); handleOpenPomodoro(task.id, task.title); }}
                        activeOpacity={0.8}
                      >
                        <Play size={14} color={cardTextColor} fill={cardTextColor} />
                        <Text style={[styles.pomodoroPlayBtnText, { color: cardTextColor }]}>Foco</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Swipeable>
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

      <PomodoroModal 
        visible={pomodoroVisible} 
        onClose={() => setPomodoroVisible(false)} 
        taskTitle={selectedTask?.title || 'Tarefa'} 
        taskId={selectedTask?.id}
      />
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
      flexDirection: 'row', alignItems: 'center', borderRadius: 16,
      padding: 16, marginBottom: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.08)',
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
    pomodoroPlayBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 },
    pomodoroPlayBtnText: { fontFamily: FONTS.bold, fontSize: 10, color: '#111827' },
    completedCard: { backgroundColor: colors.surface, opacity: 0.65 },
    completedText: { textDecorationLine: 'line-through', color: colors.textSecondary },
    leftAction: {
      flex: 1, backgroundColor: colors.success, justifyContent: 'center', alignItems: 'flex-start',
      paddingLeft: 24, marginBottom: 10, borderRadius: 16,
    },
    rightAction: {
      flex: 1, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'flex-end',
      paddingRight: 24, marginBottom: 10, borderRadius: 16,
    },
    actionText: { color: '#FFFFFF', fontFamily: FONTS.bold, fontSize: SIZES.sm, marginTop: 4 },
    emptyCard: {
      backgroundColor: colors.surface, borderRadius: 16,
      padding: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, ...SHADOWS.light,
    },
    emptyText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: colors.textSecondary },
  });
}
