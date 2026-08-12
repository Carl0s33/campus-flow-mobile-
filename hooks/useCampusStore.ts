import { create } from 'zustand';
import { Discipline, Schedule, Task, Exam } from '../types/campus';

interface CampusState {
  userName: string;
  disciplines: Discipline[];
  schedules: Schedule[];
  tasks: Task[];
  exams: Exam[];
  addDiscipline: (discipline: Discipline) => void;
  removeDiscipline: (id: string) => void;
  incrementAbsence: (id: string) => void;
  addSchedule: (schedule: Schedule) => void;
  removeSchedule: (id: string) => void;
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  addExam: (exam: Exam) => void;
  removeExam: (id: string) => void;
}

export const useCampusStore = create<CampusState>((set) => ({
  userName: 'Carlos',
  disciplines: [],
  schedules: [],
  tasks: [],
  exams: [],
  addDiscipline: (discipline) => set((state) => ({ disciplines: [...state.disciplines, discipline] })),
  removeDiscipline: (id) => set((state) => ({ disciplines: state.disciplines.filter(d => d.id !== id) })),
  incrementAbsence: (id) => set((state) => ({
    disciplines: state.disciplines.map(d => d.id === id ? { ...d, absences: d.absences + 1 } : d)
  })),
  addSchedule: (schedule) => set((state) => ({ schedules: [...state.schedules, schedule] })),
  removeSchedule: (id) => set((state) => ({ schedules: state.schedules.filter(s => s.id !== id) })),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  })),
  removeTask: (id) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) })),
  addExam: (exam) => set((state) => ({ exams: [...state.exams, exam] })),
  removeExam: (id) => set((state) => ({ exams: state.exams.filter(e => e.id !== id) })),
}));
