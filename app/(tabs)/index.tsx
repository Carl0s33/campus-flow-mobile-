import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampusStore } from '@/hooks/useCampusStore';
import TopAppBar from '@/components/TopAppBar';
import NowHappeningCard from '@/components/NowHappeningCard';
import { FONTS, SIZES, BORDER, SHADOWS, getContrastTextColor } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { Clock, MapPin, User, Calendar as CalendarIcon, CheckSquare, AlertCircle } from 'lucide-react-native';
import { formatDueDate, isDueToday } from '@/utils/dateHelpers';
import { requestNotificationPermissions, scheduleClassReminder } from '@/hooks/useNotifications';
import { Atom, TrendingUp } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const userName = useCampusStore(state => state.userName);
  const disciplines = useCampusStore(state => state.disciplines);
  const schedules = useCampusStore(state => state.schedules);
  const tasks = useCampusStore(state => state.tasks);
  const exams = useCampusStore(state => state.exams);
  const fetchData = useCampusStore(state => state.fetchData);
  const isSyncing = useCampusStore(state => state.isSyncing);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const getDayOfWeek = () => {
    const today = new Date().getDay();
    return today === 0 ? 1 : today;
  };

  const getNextClass = () => {
    const today = getDayOfWeek();
    const todaySchedules = schedules
      .filter(s => s.dayOfWeek === today)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    // Assume current time is 08:00 for the mockup
    return todaySchedules.find(s => s.startTime >= '08:00') || null;
  };

  const currentClass = getNextClass();

  React.useEffect(() => {
    requestNotificationPermissions().then((granted) => {
      if (granted && currentClass) {
        const disc = disciplines.find(d => d.id === currentClass.disciplineId);
        // Agendar notificação fake para fins de demonstração (5 seg)
        if (disc) {
          scheduleClassReminder(disc.name, currentClass.room, currentClass.startTime);
        }
      }
    });
  }, []);

  const todaySchedules = schedules
    .filter(s => s.dayOfWeek === getDayOfWeek())
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const currentDiscipline = currentClass ? disciplines.find(d => d.id === currentClass.disciplineId) : null;
  const remainingTodaySchedules = todaySchedules
    .slice(1)
    .filter(sched => sched.disciplineId !== currentClass?.disciplineId);

  const pendingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Próxima Prova
  const upcomingExams = exams
    .filter(e => new Date(e.date).getTime() >= new Date().setHours(0,0,0,0))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextExam = upcomingExams[0];

  // Métrica 1: Faltas Totais
  const totalAbsences = disciplines.reduce((acc, curr) => acc + curr.absences, 0);

  // Métrica 2: IRA (Índice de Rendimento Acadêmico) ponderado por workload
  let totalIraSum = 0;
  let totalWorkload = 0;
  disciplines.forEach(d => {
    if (d.finalGrade && d.finalGrade > 0 && d.workload) {
      totalIraSum += d.finalGrade * d.workload;
      totalWorkload += d.workload;
    }
  });
  const iraGlobal = totalWorkload > 0 ? (totalIraSum / totalWorkload).toFixed(2) : '-';

  // Métrica 3: Total de Pomodoros (Tempo de Foco)
  const disciplinePomodoros = disciplines.reduce((acc, curr) => acc + (curr.pomodoroCount || 0), 0);
  const taskPomodoros = tasks.reduce((acc, curr) => acc + (curr.pomodoroCount || 0), 0);
  const totalPomodoros = disciplinePomodoros + taskPomodoros;

  const styles = makeStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <TopAppBar
        showGreeting
        userName={userName}
        dateStr={new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >

        {/* HERO SECTION */}
        <NowHappeningCard
          title={currentDiscipline?.name}
          startTime={currentClass?.startTime}
          endTime={currentClass?.endTime}
          room={currentClass?.room}
          teacher={currentDiscipline?.teacher}
          isCurrent={Boolean(currentClass)}
          color={currentDiscipline?.color}
          onPressDetails={() => router.push('/(tabs)/calendario')}
          onPressAdd={() => router.push('/nova-disciplina')}
        />

        {/* STATS WIDGET */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: colors.surface }]}
            onPress={() => router.push('/(tabs)/calendario')}
            activeOpacity={0.8}
          >
            <CalendarIcon size={18} color={colors.matteBlue} />
            <Text style={[styles.statNumber, { color: colors.matteBlue }]}>{todaySchedules.length}</Text>
            <Text style={[styles.statLabel, { color: colors.matteBlue }]}>Aulas Hoje</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: colors.surface }]}
            activeOpacity={0.8}
          >
            <TrendingUp size={18} color={colors.primary} />
            <Text style={[styles.statNumber, { color: colors.primary }]}>{iraGlobal}</Text>
            <Text style={[styles.statLabel, { color: colors.primary }]}>I.R.A.</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.statsRow, { marginTop: -12 }]}>
          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: colors.surface }]}
            activeOpacity={0.8}
          >
            <Atom size={18} color={colors.mattePink} />
            <Text style={[styles.statNumber, { color: colors.mattePink }]}>{totalPomodoros}</Text>
            <Text style={[styles.statLabel, { color: colors.mattePink }]}>Ciclos Pomodoro</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: colors.surface }]}
            onPress={() => router.push('/(tabs)/disciplinas')}
            activeOpacity={0.8}
          >
            <AlertCircle size={18} color={colors.matteGreen} />
            <Text style={[styles.statNumber, { color: colors.matteGreen }]}>{totalAbsences}</Text>
            <Text style={[styles.statLabel, { color: colors.matteGreen }]}>Faltas Totais</Text>
          </TouchableOpacity>
        </View>

        {/* PRÓXIMAS AULAS DE HOJE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximas Aulas de Hoje</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/calendario')}>
              <Text style={styles.seeAllText}>Ver Grade</Text>
            </TouchableOpacity>
          </View>

          {remainingTodaySchedules.length === 0 ? (
            <View style={styles.emptyPostIt}>
              <CalendarIcon size={18} color={colors.textSecondary} />
              <Text style={styles.emptyPostItText}>Não há outras aulas agendadas para hoje.</Text>
            </View>
          ) : (
            <View style={styles.timelineList}>
              {remainingTodaySchedules.map((sched) => {
                const disc = disciplines.find(d => d.id === sched.disciplineId);
                const matteBg = disc?.color || colors.matteGreen;

                return (
                  <View key={sched.id} style={[styles.classCard, { backgroundColor: colors.surface }]}>
                    <View style={styles.cardTopRow}>
                      <View style={[styles.pinDot, { backgroundColor: matteBg, width: 10, height: 10, borderRadius: 5 }]} />
                      <View style={styles.timeBadge}>
                        <Clock size={12} color={colors.textSecondary} />
                        <Text style={[styles.timeText, { color: colors.textSecondary }]}>{sched.startTime} - {sched.endTime}</Text>
                      </View>
                    </View>

                    <Text style={[styles.classTitle, { color: colors.textPrimary }]}>{disc?.name || 'Disciplina'}</Text>

                    <View style={styles.metaRow}>
                      <View style={styles.metaChip}>
                        <MapPin size={12} color={colors.textSecondary} />
                        <Text style={[styles.metaText, { color: colors.textSecondary }]}>{sched.room}</Text>
                      </View>
                      {disc?.teacher && (
                        <View style={styles.metaChip}>
                          <User size={12} color={colors.textSecondary} />
                          <Text style={[styles.metaText, { color: colors.textSecondary }]}>{disc.teacher}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* PRÓXIMA PROVA (EXAM) */}
        {nextExam && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Avaliação Importante</Text>
            </View>
            <View style={[styles.taskCard, styles.examCard]}>
              <View style={styles.taskHeader}>
                <View style={styles.taskDisciplineRow}>
                  <AlertCircle size={16} color={isDark ? '#F87171' : '#DC2626'} />
                  <Text style={[styles.taskSubject, { color: isDark ? '#F87171' : '#DC2626' }]} numberOfLines={1}>
                    {disciplines.find(d => d.id === nextExam.disciplineId)?.name || 'Geral'}
                  </Text>
                </View>
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentBadgeText}>Prova</Text>
                </View>
              </View>

              <Text style={[styles.taskTitle, { color: colors.textPrimary }]}>{nextExam.title}</Text>

              <View style={styles.taskDueRow}>
                <CalendarIcon size={14} color={isDark ? '#F87171' : '#DC2626'} />
                <Text style={[styles.taskDueText, { color: isDark ? '#F87171' : '#DC2626', fontFamily: FONTS.bold }]}>
                  {formatDueDate(nextExam.date)} às {nextExam.time}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* PRAZOS PRÓXIMOS (TAREFAS) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Prazos Próximos</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/agenda')}>
              <Text style={styles.seeAllText}>Ver Tarefas</Text>
            </TouchableOpacity>
          </View>

          {pendingTasks.length === 0 ? (
            <View style={styles.emptyPostIt}>
              <CheckSquare size={18} color={colors.textSecondary} />
              <Text style={styles.emptyPostItText}>Nenhuma tarefa pendente!</Text>
            </View>
          ) : (
            <View style={styles.timelineList}>
              {pendingTasks.map((task, idx) => {
                const disc = disciplines.find(d => d.id === task.disciplineId);
                const matteBg = disc?.color || colors.matteYellow;

                // Simulação simples de urgência: se for hoje
                const urgent = isDueToday(task.dueDate);

                return (
                  <View key={task.id} style={[styles.taskCard, { backgroundColor: colors.surface }]}>
                    <View style={styles.taskHeader}>
                      <View style={styles.taskDisciplineRow}>
                        <View style={[styles.pinDot, { backgroundColor: matteBg, width: 8, height: 8, borderRadius: 4 }]} />
                        <Text style={[styles.taskSubject, { color: colors.textSecondary }]} numberOfLines={1}>
                          {disc?.name || 'Geral'}
                        </Text>
                      </View>
                      {urgent && (
                        <View style={styles.urgentBadge}>
                          <Text style={styles.urgentBadgeText}>Vence Hoje</Text>
                        </View>
                      )}
                    </View>

                    <Text style={[styles.taskTitle, { color: colors.textPrimary }]}>{task.title}</Text>

                    <View style={styles.taskDueRow}>
                      <CalendarIcon size={14} color={colors.textTertiary} />
                      <Text style={[styles.taskDueText, { color: colors.textSecondary }]}>{formatDueDate(task.dueDate)}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { padding: 24, paddingBottom: 110 },
    statsRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
    statCard: {
      flex: 1,
      padding: 12,
      borderRadius: BORDER.radiusLg,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.08)',
      alignItems: 'center',
      gap: 4,
      ...SHADOWS.postIt,
    },
    statNumber: { fontFamily: FONTS.bold, fontSize: SIZES.xl },
    statLabel: { fontFamily: FONTS.semiBold, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 },
    section: { marginBottom: 28 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: colors.textPrimary },
    seeAllText: { fontFamily: FONTS.bold, fontSize: SIZES.sm, color: colors.primary },
    timelineList: { gap: 16 },
    classCard: {
      borderRadius: BORDER.radiusLg,
      padding: 20,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.08)',
      ...SHADOWS.postIt,
    },
    cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    pinDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.25)' },
    timeBadge: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      backgroundColor: 'rgba(0,0,0,0.08)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999,
    },
    timeText: { fontFamily: FONTS.bold, fontSize: SIZES.xs },
    classTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, marginBottom: 10, lineHeight: 24 },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    metaChip: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      backgroundColor: 'rgba(0,0,0,0.07)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: BORDER.radiusSm,
    },
    metaText: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs },
    taskCard: {
      borderRadius: BORDER.radiusLg, padding: 20,
      borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', ...SHADOWS.postIt,
    },
    taskHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    taskDisciplineRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
    taskSubject: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs },
    urgentBadge: {
      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: BORDER.radiusSm,
    },
    urgentBadgeText: {
      color: isDark ? '#F87171' : '#DC2626',
      fontFamily: FONTS.bold,
      fontSize: 10,
      textTransform: 'uppercase',
    },
    taskTitle: { fontFamily: FONTS.bold, fontSize: SIZES.md, lineHeight: 22, marginBottom: 12 },
    taskDueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    taskDueText: { fontFamily: FONTS.medium, fontSize: SIZES.sm },
    examCard: {
      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
      borderColor: isDark ? 'rgba(239, 68, 68, 0.4)' : '#FECACA',
      borderWidth: 1,
      ...SHADOWS.light,
    },
    emptyPostIt: {
      backgroundColor: colors.surface, borderRadius: BORDER.radiusLg, padding: 20,
      borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', flexDirection: 'row', alignItems: 'center', gap: 12, ...SHADOWS.light,
    },
    emptyPostItText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: colors.textSecondary },
    horizontalScroll: { marginHorizontal: -24 },
    horizontalContent: { paddingHorizontal: 24, gap: 14 },
  });
}
