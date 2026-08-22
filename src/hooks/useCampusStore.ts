import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Discipline, Schedule, Task, Exam } from '@/types/campus';
import { disciplineApi, scheduleApi, taskApi, examApi, DisciplineDTO, TaskDTO, ExamDTO, ScheduleDTO } from '@/services/api';

interface CampusState {
  userName: string;
  matricula: string;
  email: string;
  photoUrl: string | null;
  isAuthenticated: boolean;
  disciplines: Discipline[];
  schedules: Schedule[];
  tasks: Task[];
  exams: Exam[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  pendingPomodoros: { type: 'task' | 'discipline'; id: string }[];

  // Ações de autenticação
  setUserName: (name: string) => void;
  setMatricula: (matricula: string) => void;
  login: (name: string, matricula: string, email?: string, photoUrl?: string | null) => void;
  setPhotoUrl: (url: string | null) => void;
  logout: () => void;

  // Ações de fila
  removePendingPomodoro: (index: number) => void;
  
  // Ações de sincronização
  fetchData: () => Promise<void>;
  
  // Ações de Disciplina
  addDiscipline: (discipline: Omit<Discipline, 'id'> & { id?: string }) => Promise<Discipline | undefined>;
  updateDiscipline: (id: string, data: Partial<Discipline>) => Promise<Discipline | undefined>;
  removeDiscipline: (id: string) => Promise<void>;
  setGrade: (id: string, n1?: number, n2?: number, recoveryGrade?: number) => Promise<void>;
  incrementAbsence: (id: string) => Promise<void>;
  decrementAbsence: (id: string) => Promise<void>;
  
  // Ações de Horário
  addSchedule: (schedule: Omit<Schedule, 'id'> & { id?: string }) => Promise<Schedule | undefined>;
  removeSchedule: (id: string) => Promise<void>;
  
  // Ações de Tarefas
  addTask: (task: Omit<Task, 'id'> & { id?: string }) => Promise<Task | undefined>;
  toggleTask: (id: string) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  
  // Ações de Provas
  addExam: (exam: Omit<Exam, 'id'> & { id?: string }) => Promise<Exam | undefined>;
  removeExam: (id: string) => Promise<void>;

  // Ações de Pomodoro
  incrementTaskPomodoro: (id: string) => Promise<void>;
  incrementDisciplinePomodoro: (id: string) => Promise<void>;
}

// Conversores de DTO para modelos de visualização do app
function dtoToDiscipline(dto: DisciplineDTO): Discipline {
  return {
    id: dto.id || Date.now().toString(),
    name: dto.name,
    code: dto.code || undefined,
    teacher: dto.teacher || undefined,
    color: dto.color || '#60A5FA',
    absences: dto.absences ?? 0,
    workload: dto.workload ?? 60,
    period: dto.period,
    grades: (dto.n1 !== undefined || dto.n2 !== undefined || dto.recoveryGrade !== undefined) 
      ? { n1: dto.n1, n2: dto.n2, recoveryGrade: dto.recoveryGrade } 
      : undefined,
    pomodoroCount: dto.pomodoroCount ?? 0,
    finalGrade: dto.finalGrade,
    statusText: dto.statusText,
    statusColor: dto.statusColor,
    isApproved: dto.isApproved,
    inRecovery: dto.inRecovery,
  };
}

function dtoToSchedule(dto: ScheduleDTO): Schedule {
  return {
    id: dto.id || Date.now().toString(),
    disciplineId: dto.disciplineId,
    dayOfWeek: dto.dayOfWeek,
    startTime: dto.startTime,
    endTime: dto.endTime,
    room: dto.room || '',
  };
}

function dtoToTask(dto: TaskDTO): Task {
  return {
    id: dto.id || Date.now().toString(),
    title: dto.title,
    disciplineId: dto.disciplineId,
    dueDate: dto.dueDate,
    completed: Boolean(dto.completed),
    type: (dto.type === 'trabalho' ? 'trabalho' : 'atividade') as 'trabalho' | 'atividade',
    pomodoroCount: dto.pomodoroCount ?? 0,
  };
}

function dtoToExam(dto: ExamDTO): Exam {
  return {
    id: dto.id || Date.now().toString(),
    title: dto.title,
    disciplineId: dto.disciplineId,
    date: dto.date,
    time: dto.time || '',
    topics: dto.topics || undefined,
  };
}

import { ALL_TADS_DISCIPLINES } from '@/constants/tadsDisciplines';

export const useCampusStore = create<CampusState>()(
  persist(
    (set, get) => ({
      userName: 'Carlos Eduardo',
      matricula: '20241134040016',
      email: '',
      photoUrl: null,
      isAuthenticated: false,
      disciplines: ALL_TADS_DISCIPLINES,
      schedules: [],
      tasks: [],
      exams: [],
      isLoading: false,
      isSyncing: false,
      error: null,
      pendingPomodoros: [],

      // Ações de autenticação
      setUserName: (name: string) => set({ userName: name }),
      setMatricula: (matricula: string) => set({ matricula }),
      login: (name: string, matricula: string, email?: string, photoUrl?: string | null) =>
        set({ userName: name, matricula, email: email || '', photoUrl: photoUrl || null, isAuthenticated: true }),
      setPhotoUrl: (url: string | null) => set({ photoUrl: url }),
      logout: () => set({ isAuthenticated: false, userName: '', matricula: '', email: '', photoUrl: null }),

      removePendingPomodoro: (index: number) => {
        set((state) => {
          const newPending = [...state.pendingPomodoros];
          newPending.splice(index, 1);
          return { pendingPomodoros: newPending };
        });
      },

  fetchData: async () => {
    set({ isSyncing: true, error: null });
    try {
      const [discRes, schedRes, taskRes, examRes] = await Promise.allSettled([
        disciplineApi.getAll(),
        scheduleApi.getAll(),
        taskApi.getAll(),
        examApi.getAll(),
      ]);

      set((state) => {
        let mergedDisciplines = state.disciplines;
        if (discRes.status === 'fulfilled' && discRes.value.length > 0) {
          const fetched = discRes.value.map(dtoToDiscipline);
          const fetchedMap = new Map(fetched.map(d => [d.id, d]));
          // Mescla atualizações com a lista base
          mergedDisciplines = ALL_TADS_DISCIPLINES.map(base => fetchedMap.get(base.id) || base);
          // Adiciona disciplinas novas criadas pelo usuário
          fetched.forEach(d => {
            if (!mergedDisciplines.some(m => m.id === d.id)) {
              mergedDisciplines.push(d);
            }
          });
        }

        return {
          disciplines: mergedDisciplines,
          schedules: schedRes.status === 'fulfilled'
            ? schedRes.value.map(dtoToSchedule)
            : state.schedules,
          tasks: taskRes.status === 'fulfilled'
            ? taskRes.value.map(dtoToTask)
            : state.tasks,
          exams: examRes.status === 'fulfilled'
            ? examRes.value.map(dtoToExam)
            : state.exams,
          isSyncing: false,
        };
      });
    } catch (err: any) {
      console.warn('Erro ao conectar com backend:', err.message);
      set({ isSyncing: false, error: err.message });
    }
  },

  // -------------------------------------------------------------
  // DISCIPLINAS
  // -------------------------------------------------------------
  addDiscipline: async (discipline) => {
    try {
      const created = await disciplineApi.create({
        name: discipline.name,
        code: discipline.code,
        teacher: discipline.teacher,
        color: discipline.color,
        absences: discipline.absences || 0,
        workload: discipline.workload || 60,
        period: discipline.period,
        n1: discipline.grades?.n1,
        n2: discipline.grades?.n2,
        recoveryGrade: discipline.grades?.recoveryGrade,
      });

      const formatted = dtoToDiscipline(created);
      set((state) => ({ disciplines: [...state.disciplines, formatted] }));
      return formatted;
    } catch (err: any) {
      console.warn('Backend offline ou com erro, adicionando localmente:', err.message);
      const localDiscipline: Discipline = {
        ...discipline,
        id: discipline.id || Date.now().toString(),
        absences: discipline.absences || 0,
        workload: discipline.workload || 60,
      };
      set((state) => ({ disciplines: [...state.disciplines, localDiscipline] }));
      return localDiscipline;
    }
  },

  updateDiscipline: async (id, data) => {
    set((state) => ({
      disciplines: state.disciplines.map(d => d.id === id ? { ...d, ...data } : d)
    }));

    try {
      const current = get().disciplines.find(d => d.id === id);
      const updated = await disciplineApi.update(id, {
        name: data.name ?? current?.name ?? '',
        code: data.code ?? current?.code,
        teacher: data.teacher ?? current?.teacher,
        color: data.color ?? current?.color,
        absences: data.absences ?? current?.absences,
        workload: data.workload ?? current?.workload,
        period: data.period ?? current?.period,
        n1: data.grades?.n1 ?? current?.grades?.n1,
        n2: data.grades?.n2 ?? current?.grades?.n2,
        recoveryGrade: data.grades?.recoveryGrade ?? current?.grades?.recoveryGrade,
      });
      const formatted = dtoToDiscipline(updated);
      set((state) => ({
        disciplines: state.disciplines.map(d => d.id === id ? formatted : d)
      }));
      return formatted;
    } catch (err: any) {
      console.warn('Erro ao atualizar disciplina no backend:', err.message);
      return get().disciplines.find(d => d.id === id);
    }
  },

  removeDiscipline: async (id) => {
    // Atualização otimista
    set((state) => ({
      disciplines: state.disciplines.filter(d => d.id !== id),
      schedules: state.schedules.filter(s => s.disciplineId !== id),
      tasks: state.tasks.filter(t => t.disciplineId !== id),
      exams: state.exams.filter(e => e.disciplineId !== id),
    }));

    try {
      await disciplineApi.delete(id);
    } catch (err: any) {
      console.warn('Erro ao deletar disciplina no backend:', err.message);
    }
  },

  setGrade: async (id, n1, n2, recoveryGrade) => {
    set((state) => ({
      disciplines: state.disciplines.map(d =>
        d.id === id ? { 
          ...d, 
          grades: { 
            ...d.grades, 
            n1: n1 ?? d.grades?.n1, 
            n2: n2 ?? d.grades?.n2,
            recoveryGrade: recoveryGrade ?? d.grades?.recoveryGrade 
          } 
        } : d
      )
    }));

    try {
      await disciplineApi.updateGrades(id, n1, n2, recoveryGrade);
    } catch (err: any) {
      console.warn('Erro ao atualizar notas no backend:', err.message);
    }
  },

  incrementAbsence: async (id) => {
    const current = get().disciplines.find(d => d.id === id);
    const newAbsences = (current?.absences ?? 0) + 1;

    set((state) => ({
      disciplines: state.disciplines.map(d => d.id === id ? { ...d, absences: newAbsences } : d)
    }));

    try {
      await disciplineApi.updateAbsences(id, newAbsences);
    } catch (err: any) {
      console.warn('Erro ao atualizar faltas no backend:', err.message);
    }
  },

  decrementAbsence: async (id) => {
    const current = get().disciplines.find(d => d.id === id);
    const newAbsences = Math.max(0, (current?.absences ?? 0) - 1);

    set((state) => ({
      disciplines: state.disciplines.map(d => d.id === id ? { ...d, absences: newAbsences } : d)
    }));

    try {
      await disciplineApi.updateAbsences(id, newAbsences);
    } catch (err: any) {
      console.warn('Erro ao atualizar faltas no backend:', err.message);
    }
  },

  // -------------------------------------------------------------
  // HORÁRIOS (SCHEDULES)
  // -------------------------------------------------------------
  addSchedule: async (schedule) => {
    try {
      const created = await scheduleApi.create({
        disciplineId: schedule.disciplineId,
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        room: schedule.room,
      });

      const formatted = dtoToSchedule(created);
      set((state) => ({ schedules: [...state.schedules, formatted] }));
      return formatted;
    } catch (err: any) {
      console.warn('Backend offline ou erro ao adicionar horário, adicionando localmente:', err.message);
      const localSchedule: Schedule = {
        ...schedule,
        id: schedule.id || Date.now().toString(),
      };
      set((state) => ({ schedules: [...state.schedules, localSchedule] }));
      return localSchedule;
    }
  },

  removeSchedule: async (id) => {
    set((state) => ({ schedules: state.schedules.filter(s => s.id !== id) }));
    try {
      await scheduleApi.delete(id);
    } catch (err: any) {
      console.warn('Erro ao remover horário no backend:', err.message);
    }
  },

  // -------------------------------------------------------------
  // TAREFAS (TASKS)
  // -------------------------------------------------------------
  addTask: async (task) => {
    try {
      const created = await taskApi.create({
        title: task.title,
        disciplineId: task.disciplineId,
        dueDate: task.dueDate,
        completed: task.completed,
        type: task.type,
      });

      const formatted = dtoToTask(created);
      set((state) => ({ tasks: [...state.tasks, formatted] }));
      return formatted;
    } catch (err: any) {
      console.warn('Backend offline ou erro ao criar tarefa, criando localmente:', err.message);
      const localTask: Task = {
        ...task,
        id: task.id || Date.now().toString(),
      };
      set((state) => ({ tasks: [...state.tasks, localTask] }));
      return localTask;
    }
  },

  toggleTask: async (id) => {
    set((state) => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));

    try {
      await taskApi.toggle(id);
    } catch (err: any) {
      console.warn('Erro ao alterar status da tarefa no backend:', err.message);
    }
  },

  removeTask: async (id) => {
    set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) }));
    try {
      await taskApi.delete(id);
    } catch (err: any) {
      console.warn('Erro ao remover tarefa no backend:', err.message);
    }
  },

  // -------------------------------------------------------------
  // PROVAS (EXAMS)
  // -------------------------------------------------------------
  addExam: async (exam) => {
    try {
      const created = await examApi.create({
        title: exam.title,
        disciplineId: exam.disciplineId,
        date: exam.date,
        time: exam.time,
        topics: exam.topics,
      });

      const formatted = dtoToExam(created);
      set((state) => ({ exams: [...state.exams, formatted] }));
      return formatted;
    } catch (err: any) {
      console.warn('Backend offline ou erro ao criar prova, criando localmente:', err.message);
      const localExam: Exam = {
        ...exam,
        id: exam.id || Date.now().toString(),
      };
      set((state) => ({ exams: [...state.exams, localExam] }));
      return localExam;
    }
  },

  removeExam: async (id) => {
    set((state) => ({ exams: state.exams.filter(e => e.id !== id) }));
    try {
      await examApi.delete(id);
    } catch (err: any) {
      console.warn('Erro ao remover prova no backend:', err.message);
    }
  },

  // -------------------------------------------------------------
  // POMODORO (FOCUS METRICS)
  // -------------------------------------------------------------
  incrementTaskPomodoro: async (id) => {
    set((state) => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, pomodoroCount: (t.pomodoroCount || 0) + 1 } : t)
    }));
    try {
      await taskApi.incrementPomodoro(id);
    } catch (err: any) {
      console.warn('Erro ao incrementar pomodoro na tarefa, adicionando à fila:', err.message);
      set((state) => ({
        pendingPomodoros: [...state.pendingPomodoros, { type: 'task', id }]
      }));
    }
  },

  incrementDisciplinePomodoro: async (id) => {
    set((state) => ({
      disciplines: state.disciplines.map(d => d.id === id ? { ...d, pomodoroCount: (d.pomodoroCount || 0) + 1 } : d)
    }));
    try {
      await disciplineApi.incrementPomodoro(id);
    } catch (err: any) {
      console.warn('Erro ao incrementar pomodoro na disciplina, adicionando à fila:', err.message);
      set((state) => ({
        pendingPomodoros: [...state.pendingPomodoros, { type: 'discipline', id }]
      }));
    }
  },
    }),
    {
      name: 'campus-flow-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
