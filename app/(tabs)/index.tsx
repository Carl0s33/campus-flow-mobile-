import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampusStore } from '../../hooks/useCampusStore';
import TopAppBar from '../../src/components/TopAppBar';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Clock, MapPin, User, ArrowRight, Plus } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const userName = useCampusStore(state => state.userName);
  const disciplines = useCampusStore(state => state.disciplines);
  const schedules = useCampusStore(state => state.schedules);
  const tasks = useCampusStore(state => state.tasks);
  const exams = useCampusStore(state => state.exams);

  const getDayOfWeek = () => {
    const today = new Date().getDay();
    return today === 0 ? 1 : today;
  };

  const getNextClass = () => {
    const today = getDayOfWeek();
    const todaySchedules = schedules.filter(s => s.dayOfWeek === today);
    if (todaySchedules.length === 0) return null;
    return todaySchedules[0];
  };

  const nextClass = getNextClass();
  const nextClassDiscipline = nextClass ? disciplines.find(d => d.id === nextClass.disciplineId) : null;
  
  const pendingTasks = tasks.filter(t => !t.completed).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const upcomingExams = [...exams].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <View style={styles.container}>
      <TopAppBar showGreeting userName={userName} dateStr="Bem-vindo de volta" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {nextClass && nextClassDiscipline ? (
          <View style={styles.currentClassCard}>
            <View style={styles.badgeRow}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>PRÓXIMA AULA</Text>
            </View>
            <Text style={styles.currentTitle}>{nextClassDiscipline.name}</Text>
            
            <View style={styles.currentDetails}>
              <View style={styles.detailItem}>
                <Clock size={16} color="rgba(255,255,255,0.9)" />
                <Text style={styles.detailText}>{nextClass.startTime} - {nextClass.endTime}</Text>
              </View>
              <View style={styles.detailItem}>
                <MapPin size={16} color="rgba(255,255,255,0.9)" />
                <Text style={styles.detailText}>{nextClass.room}</Text>
              </View>
              {nextClassDiscipline.teacher && (
                <View style={styles.detailItem}>
                  <User size={16} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.detailText}>{nextClassDiscipline.teacher}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.materialsBtn}>
              <Text style={styles.materialsBtnText}>Detalhes</Text>
              <ArrowRight size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyClassCard}>
            <Text style={styles.emptyClassTitle}>Sua grade está vazia</Text>
            <Text style={styles.emptyClassText}>Adicione uma matéria e um horário para visualizar as próximas aulas aqui.</Text>
            <TouchableOpacity style={styles.emptyClassBtn} onPress={() => router.push('/nova-disciplina')}>
              <Text style={styles.emptyClassBtnText}>Cadastrar Matéria</Text>
              <Plus size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atividades Pendentes</Text>
          {pendingTasks.length === 0 ? (
            <View style={styles.emptyPlaceholder}>
              <Text style={styles.emptyPlaceholderText}>Tudo em dia por aqui!</Text>
              <TouchableOpacity style={styles.emptyPlaceholderBtn} onPress={() => router.push('/nova-tarefa')}>
                <Text style={styles.emptyPlaceholderBtnText}>Nova Tarefa</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={styles.horizontalContent}>
              {pendingTasks.map((task) => {
                const discipline = disciplines.find(d => d.id === task.disciplineId);
                return (
                  <View key={task.id} style={styles.taskCard}>
                    <View style={styles.taskHeader}>
                      <View style={styles.subjectBadge}>
                        <Text style={styles.subjectBadgeText}>{discipline?.name || 'Geral'}</Text>
                      </View>
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>{task.type}</Text>
                      </View>
                    </View>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <View style={styles.dueRow}>
                      <Clock size={12} color={COLORS.error} />
                      <Text style={styles.dueText}>{task.dueDate}</Text>
                    </View>
                  </View>
                )
              })}
            </ScrollView>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximas Provas</Text>
          {upcomingExams.length === 0 ? (
            <View style={styles.emptyPlaceholder}>
              <Text style={styles.emptyPlaceholderText}>Nenhuma avaliação agendada.</Text>
              <TouchableOpacity style={styles.emptyPlaceholderBtn} onPress={() => router.push('/nova-prova')}>
                <Text style={styles.emptyPlaceholderBtnText}>Agendar Prova</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={styles.horizontalContent}>
              {upcomingExams.map((exam) => {
                const discipline = disciplines.find(d => d.id === exam.disciplineId);
                return (
                  <View key={exam.id} style={styles.taskCard}>
                    <View style={styles.taskHeader}>
                      <View style={styles.subjectBadge}>
                        <Text style={styles.subjectBadgeText}>{discipline?.name || 'Geral'}</Text>
                      </View>
                    </View>
                    <Text style={styles.taskTitle}>{exam.title}</Text>
                    <View style={styles.dueRow}>
                      <Clock size={12} color={COLORS.primaryDark} />
                      <Text style={styles.dueTextDark}>{exam.date} • {exam.time}</Text>
                    </View>
                  </View>
                )
              })}
            </ScrollView>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20, paddingBottom: 100 },
  currentClassCard: {
    backgroundColor: COLORS.primary, borderRadius: 16, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 30, elevation: 5, marginBottom: 32,
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  badgeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.surface },
  badgeText: { color: 'rgba(255,255,255,0.8)', fontFamily: FONTS.semiBold, fontSize: SIZES.sm, letterSpacing: 0.7 },
  currentTitle: { color: COLORS.surface, fontFamily: FONTS.bold, fontSize: SIZES.xxxl, lineHeight: 48, marginBottom: 16 },
  currentDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { color: 'rgba(255,255,255,0.9)', fontFamily: FONTS.regular, fontSize: SIZES.md },
  materialsBtn: { backgroundColor: COLORS.surface, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 8 },
  materialsBtnText: { color: COLORS.primary, fontFamily: FONTS.semiBold, fontSize: SIZES.sm },
  emptyClassCard: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.borderLight, borderRadius: 16, padding: 24, marginBottom: 32, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 1
  },
  emptyClassTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xl, color: COLORS.textPrimary },
  emptyClassText: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, lineHeight: 20 },
  emptyClassBtn: { backgroundColor: COLORS.primaryLight, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 8 },
  emptyClassBtnText: { color: COLORS.primaryDark, fontFamily: FONTS.bold, fontSize: SIZES.sm },
  section: { marginBottom: 32 },
  sectionTitle: { fontFamily: FONTS.semiBold, fontSize: SIZES.xxl, color: COLORS.textPrimary, marginBottom: 16 },
  horizontalScroll: { marginHorizontal: -20 },
  horizontalContent: { paddingHorizontal: 20, gap: 16 },
  taskCard: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 24, width: 280, borderWidth: 1, borderColor: 'rgba(255,218,214,0.5)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2,
  },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  subjectBadge: { backgroundColor: '#f3f4f5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 },
  subjectBadgeText: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.textSecondary },
  typeBadge: { backgroundColor: 'rgba(255,218,214,0.3)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  typeText: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.error },
  taskTitle: { fontFamily: FONTS.semiBold, fontSize: SIZES.xl, color: COLORS.textPrimary, marginBottom: 16 },
  dueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dueText: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.error },
  dueTextDark: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.primaryDark },
  emptyPlaceholder: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: COLORS.borderLight, alignItems: 'center', gap: 12 },
  emptyPlaceholderText: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary },
  emptyPlaceholderBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, borderStyle: 'dashed', borderWidth: 1, borderColor: COLORS.primary },
  emptyPlaceholderBtnText: { fontFamily: FONTS.bold, fontSize: SIZES.xs, color: COLORS.primary },
});
