import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampusStore } from '../../hooks/useCampusStore';
import TopAppBar from '../../src/components/TopAppBar';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Clock, Plus } from 'lucide-react-native';

export default function AgendaScreen() {
  const router = useRouter();
  const tasks = useCampusStore(state => state.tasks);
  const exams = useCampusStore(state => state.exams);
  const disciplines = useCampusStore(state => state.disciplines);
  const toggleTask = useCampusStore(state => state.toggleTask);

  const [activeTab, setActiveTab] = useState<'Proximos' | 'Concluidos'>('Proximos');

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <View style={styles.container}>
      <TopAppBar />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>Agenda</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => router.push('/nova-tarefa')} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Tarefa</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/nova-prova')} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Prova</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.pageSubtitle}>Gerencie suas tarefas acadêmicas e provas.</Text>
          
          <View style={styles.segmentedControl}>
            <TouchableOpacity 
              style={[styles.segmentButton, activeTab === 'Proximos' && styles.segmentButtonActive]}
              onPress={() => setActiveTab('Proximos')}
            >
              <Text style={[styles.segmentText, activeTab === 'Proximos' && styles.segmentTextActive]}>Pendentes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.segmentButton, activeTab === 'Concluidos' && styles.segmentButtonActive]}
              onPress={() => setActiveTab('Concluidos')}
            >
              <Text style={[styles.segmentText, activeTab === 'Concluidos' && styles.segmentTextActive]}>Concluídos</Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'Proximos' && (
          <View style={styles.contentArea}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Tarefas</Text>
              </View>
              
              <View style={styles.taskList}>
                {pendingTasks.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Sem tarefas pendentes por enquanto.</Text>
                    <TouchableOpacity 
                      style={styles.emptyBtn} 
                      onPress={() => router.push('/nova-tarefa')}
                    >
                      <Text style={styles.emptyBtnText}>Nova Tarefa</Text>
                      <Plus size={16} color={COLORS.surface} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  pendingTasks.map(task => {
                    const discipline = disciplines.find(d => d.id === task.disciplineId);
                    return (
                      <TouchableOpacity key={task.id} style={styles.urgentCard} onPress={() => toggleTask(task.id)}>
                        <View style={styles.urgentCardAccent} />
                        <View style={styles.cardHeader}>
                          <Text style={styles.taskTitle}>{task.title}</Text>
                          <View style={styles.subjectRow}>
                            <View style={[styles.subjectTag, { backgroundColor: discipline?.color || COLORS.borderLight }]}>
                              <Text style={styles.subjectTagText}>{discipline?.name || 'Geral'}</Text>
                            </View>
                          </View>
                        </View>
                        
                        <View style={styles.dueInfo}>
                          <View style={styles.dueRow}>
                            <Clock size={14} color={COLORS.error} />
                            <Text style={styles.dueTimeText}>{task.dueDate}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Provas</Text>
              </View>
              
              <View style={styles.taskList}>
                {exams.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhuma prova agendada.</Text>
                    <TouchableOpacity 
                      style={styles.emptyBtn} 
                      onPress={() => router.push('/nova-prova')}
                    >
                      <Text style={styles.emptyBtnText}>Agendar Prova</Text>
                      <Plus size={16} color={COLORS.surface} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  exams.map(exam => {
                    const discipline = disciplines.find(d => d.id === exam.disciplineId);
                    return (
                      <View key={exam.id} style={styles.laterCard}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.taskTitleLight}>{exam.title}</Text>
                          <View style={[styles.subjectTagSmall, { backgroundColor: discipline?.color || COLORS.borderLight }]}>
                            <Text style={styles.subjectTagTextSmall}>{discipline?.name || 'Geral'}</Text>
                          </View>
                        </View>
                        
                        <View style={styles.dueInfo}>
                          <Text style={styles.laterDateText}>{exam.date}</Text>
                          <Text style={styles.laterDateText}>{exam.time}</Text>
                        </View>
                      </View>
                    )
                  })
                )}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'Concluidos' && (
          <View style={styles.contentArea}>
            <View style={styles.taskList}>
              {completedTasks.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Nenhuma tarefa marcada como concluída.</Text>
                </View>
              ) : (
                completedTasks.map(task => (
                  <TouchableOpacity key={task.id} style={[styles.laterCard, { opacity: 0.6 }]} onPress={() => toggleTask(task.id)}>
                    <View style={styles.cardHeader}>
                      <Text style={[styles.taskTitleLight, { textDecorationLine: 'line-through' }]}>{task.title}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { marginBottom: 24, gap: 8 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerActions: { flexDirection: 'row', gap: 8 },
  addButton: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: COLORS.primaryLight, borderRadius: 8 },
  addButtonText: { fontFamily: FONTS.semiBold, fontSize: SIZES.xs, color: COLORS.primaryDark },
  pageTitle: { fontFamily: FONTS.bold, fontSize: SIZES.xxl, color: COLORS.textPrimary },
  pageSubtitle: { fontFamily: FONTS.regular, fontSize: SIZES.md, color: COLORS.textSecondary, marginBottom: 8 },
  segmentedControl: { flexDirection: 'row', backgroundColor: '#e7e8e9', padding: 4, borderRadius: 9999, alignSelf: 'flex-start' },
  segmentButton: { paddingHorizontal: 24, paddingVertical: 8, borderRadius: 9999 },
  segmentButtonActive: { backgroundColor: COLORS.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 1, elevation: 1 },
  segmentText: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.textSecondary },
  segmentTextActive: { color: COLORS.textPrimary },
  contentArea: { gap: 32 },
  section: { gap: 16 },
  sectionHeader: { borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, paddingBottom: 8 },
  sectionTitle: { fontFamily: FONTS.semiBold, fontSize: SIZES.xxl, color: COLORS.textPrimary },
  taskList: { gap: 16 },
  emptyContainer: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: COLORS.borderLight, alignItems: 'center', gap: 16, marginTop: 8 },
  emptyText: { fontFamily: FONTS.regular, fontSize: SIZES.sm, color: COLORS.textSecondary, textAlign: 'center' },
  emptyBtn: { backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  emptyBtnText: { color: COLORS.surface, fontFamily: FONTS.bold, fontSize: SIZES.sm },
  urgentCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 24, flexDirection: 'row', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 2, position: 'relative', overflow: 'hidden', justifyContent: 'space-between' },
  urgentCardAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: COLORS.error },
  cardHeader: { flex: 1, gap: 8 },
  taskTitle: { fontFamily: FONTS.regular, fontSize: SIZES.lg, color: COLORS.textPrimary, lineHeight: 28 },
  subjectRow: { flexDirection: 'row' },
  subjectTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999 },
  subjectTagText: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.textPrimary },
  dueInfo: { alignItems: 'flex-end', justifyContent: 'center', gap: 4, marginLeft: 16 },
  dueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dueTimeText: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.error },
  laterCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, flexDirection: 'row', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 2, justifyContent: 'space-between', alignItems: 'center' },
  taskTitleLight: { fontFamily: FONTS.regular, fontSize: SIZES.md, color: COLORS.textPrimary },
  subjectTagSmall: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999 },
  subjectTagTextSmall: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.textPrimary },
  laterDateText: { fontFamily: FONTS.medium, fontSize: SIZES.xs, color: COLORS.textSecondary },
});
