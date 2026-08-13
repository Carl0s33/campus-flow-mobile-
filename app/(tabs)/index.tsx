import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampusStore } from '../../hooks/useCampusStore';
import TopAppBar from '../../src/components/TopAppBar';
import NowHappeningCard from '../../src/components/NowHappeningCard';
import { FONTS, SIZES, BORDER, SHADOWS, getContrastTextColor } from '../../constants/theme';
import { useTheme } from '../../src/hooks/useTheme';
import { Clock, MapPin, User, Calendar as CalendarIcon, CheckSquare, AlertCircle } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const userName = useCampusStore(state => state.userName);
  const disciplines = useCampusStore(state => state.disciplines);
  const schedules = useCampusStore(state => state.schedules);
  const tasks = useCampusStore(state => state.tasks);

  const getDayOfWeek = () => {
    const today = new Date().getDay();
    return today === 0 ? 1 : today;
  };

  const todaySchedules = schedules
    .filter(s => s.dayOfWeek === getDayOfWeek())
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const currentClass = todaySchedules[0];
  const currentDiscipline = currentClass ? disciplines.find(d => d.id === currentClass.disciplineId) : null;
  const remainingTodaySchedules = todaySchedules.slice(1);

  const pendingTasks = tasks.filter(t => !t.completed).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const totalAbsences = disciplines.reduce((acc, curr) => acc + curr.absences, 0);

  const styles = makeStyles(colors, isDark);

  return (
    <View style={styles.container}>
      <TopAppBar
        showGreeting
        userName={userName}
        dateStr={new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* HERO SECTION */}
        <NowHappeningCard
          title={currentDiscipline?.name || 'Estrutura de Dados Não-Lineares'}
          startTime={currentClass?.startTime || '07:00'}
          endTime={currentClass?.endTime || '10:20'}
          room={currentClass?.room || 'Lab 04 - Bloco B'}
          teacher={currentDiscipline?.teacher || 'Prof. Leandro Luttiane'}
          isCurrent={true}
          onPressDetails={() => router.push('/(tabs)/calendario')}
          onPressAdd={() => router.push('/nova-disciplina')}
        />

        {/* STATS WIDGET */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: colors.matteBlue }]}
            onPress={() => router.push('/(tabs)/calendario')}
            activeOpacity={0.8}
          >
            <CalendarIcon size={18} color={getContrastTextColor(colors.matteBlue)} />
            <Text style={[styles.statNumber, { color: getContrastTextColor(colors.matteBlue) }]}>{todaySchedules.length}</Text>
            <Text style={[styles.statLabel, { color: getContrastTextColor(colors.matteBlue) }]}>Aulas Hoje</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: colors.mattePink }]}
            onPress={() => router.push('/(tabs)/agenda')}
            activeOpacity={0.8}
          >
            <CheckSquare size={18} color={getContrastTextColor(colors.mattePink)} />
            <Text style={[styles.statNumber, { color: getContrastTextColor(colors.mattePink) }]}>{pendingTasks.length}</Text>
            <Text style={[styles.statLabel, { color: getContrastTextColor(colors.mattePink) }]}>Tarefas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: colors.matteGreen }]}
            onPress={() => router.push('/(tabs)/disciplinas')}
            activeOpacity={0.8}
          >
            <AlertCircle size={18} color={getContrastTextColor(colors.matteGreen)} />
            <Text style={[styles.statNumber, { color: getContrastTextColor(colors.matteGreen) }]}>{totalAbsences}</Text>
            <Text style={[styles.statLabel, { color: getContrastTextColor(colors.matteGreen) }]}>Faltas Totais</Text>
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
                const cardTextColor = getContrastTextColor(matteBg);

                return (
                  <View key={sched.id} style={[styles.classCard, { backgroundColor: matteBg }]}>
                    <View style={styles.cardTopRow}>
                      <View style={styles.pinDot} />
                      <View style={styles.timeBadge}>
                        <Clock size={12} color={cardTextColor} />
                        <Text style={[styles.timeText, { color: cardTextColor }]}>{sched.startTime} - {sched.endTime}</Text>
                      </View>
                    </View>

                    <Text style={[styles.classTitle, { color: cardTextColor }]}>{disc?.name || 'Disciplina'}</Text>

                    <View style={styles.metaRow}>
                      <View style={styles.metaChip}>
                        <MapPin size={12} color={cardTextColor} />
                        <Text style={[styles.metaText, { color: cardTextColor }]}>{sched.room}</Text>
                      </View>
                      {disc?.teacher && (
                        <View style={styles.metaChip}>
                          <User size={12} color={cardTextColor} />
                          <Text style={[styles.metaText, { color: cardTextColor }]}>{disc.teacher}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* PRAZOS PRÓXIMOS */}
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
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
              contentContainerStyle={styles.horizontalContent}
            >
              {pendingTasks.map((task, idx) => {
                const disc = disciplines.find(d => d.id === task.disciplineId);
                const matteBg = disc?.color || (idx % 2 === 0 ? colors.mattePink : colors.matteYellow);
                const cardTextColor = getContrastTextColor(matteBg);

                return (
                  <View key={task.id} style={[styles.squarePostIt, { backgroundColor: matteBg }]}>
                    <View style={styles.squareHeader}>
                      <View style={styles.pinDot} />
                      <Text style={[styles.squareSubject, { color: cardTextColor }]} numberOfLines={1}>
                        {disc?.code || 'Geral'}
                      </Text>
                    </View>

                    <Text style={[styles.squareTitle, { color: cardTextColor }]} numberOfLines={2}>{task.title}</Text>

                    <View style={styles.squareDueRow}>
                      <Clock size={12} color="#EF4444" />
                      <Text style={styles.squareDueText}>{task.dueDate}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
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
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    statCard: {
      flex: 1,
      padding: 14,
      borderRadius: BORDER.radiusLg,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.08)',
      alignItems: 'center',
      gap: 4,
      ...SHADOWS.postIt,
    },
    statNumber: { fontFamily: FONTS.bold, fontSize: SIZES.xl },
    statLabel: { fontFamily: FONTS.semiBold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
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
    squarePostIt: {
      width: 165, height: 155, borderRadius: BORDER.radiusLg, padding: 16,
      borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', justifyContent: 'space-between', ...SHADOWS.postIt,
    },
    squareHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    squareSubject: { fontFamily: FONTS.bold, fontSize: SIZES.xs, flex: 1 },
    squareTitle: { fontFamily: FONTS.bold, fontSize: SIZES.sm, lineHeight: 20 },
    squareDueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    squareDueText: { fontFamily: FONTS.bold, fontSize: SIZES.xs, color: '#EF4444' },
    emptyPostIt: {
      backgroundColor: colors.surface, borderRadius: BORDER.radiusLg, padding: 20,
      borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 12, ...SHADOWS.light,
    },
    emptyPostItText: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: colors.textSecondary },
    horizontalScroll: { marginHorizontal: -24 },
    horizontalContent: { paddingHorizontal: 24, gap: 14 },
  });
}
