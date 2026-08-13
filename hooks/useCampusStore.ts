import { create } from 'zustand';
import { Discipline, Schedule, Task, Exam } from '../types/campus';

interface CampusState {
  userName: string;
  matricula: string;
  disciplines: Discipline[];
  schedules: Schedule[];
  tasks: Task[];
  exams: Exam[];
  addDiscipline: (discipline: Discipline) => void;
  removeDiscipline: (id: string) => void;
  incrementAbsence: (id: string) => void;
  decrementAbsence: (id: string) => void;
  addSchedule: (schedule: Schedule) => void;
  removeSchedule: (id: string) => void;
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  addExam: (exam: Exam) => void;
  removeExam: (id: string) => void;
}

// 6 Cores Fortes, Marcantes e Vibrantes para cada Disciplina
const INITIAL_DISCIPLINES: Discipline[] = [
  {
    id: 'd1',
    name: 'Estrutura de Dados Não-Lineares',
    code: 'TEC.0027',
    teacher: 'Leandro Luttiane',
    color: '#FBBF24', // 💛 Amarelo Ouro Vibrante
    absences: 0,
  },
  {
    id: 'd2',
    name: 'Teste de Software',
    code: 'TEC.0030',
    teacher: 'Mauricio Rabello',
    color: '#34D399', // 💚 Verde Esmeralda Vibrante
    absences: 1,
  },
  {
    id: 'd3',
    name: 'Desenvolvimento de Sistemas Corporativos',
    code: 'TEC.0028',
    teacher: 'Eliezio Soares',
    color: '#60A5FA', // 💙 Azul Vivo
    absences: 0,
  },
  {
    id: 'd4',
    name: 'Seminário de Orientação ao Projeto',
    code: 'TEC.0034',
    teacher: 'Eliezio Soares',
    color: '#F472B6', // 🩷 Rosa Choque Matte
    absences: 0,
  },
  {
    id: 'd5',
    name: 'Sistemas Operacionais',
    code: 'TEC.1010',
    teacher: 'Ronaldo Junior',
    color: '#A78BFA', // 💜 Roxo Violeta Vibrante
    absences: 2,
  },
  {
    id: 'd6',
    name: 'Gerência de Projetos',
    code: 'TEC.0029',
    teacher: 'Mauricio Rabello',
    color: '#FB923C', // 🧡 Laranja Tangerina Vibrante
    absences: 0,
  },
];

// Grade de Horários por Aulas Duplas do SUAP (2026.2)
const INITIAL_SCHEDULES: Schedule[] = [
  // Segunda-feira (1)
  { id: 's1', disciplineId: 'd1', dayOfWeek: 1, startTime: '07:00', endTime: '08:30', room: 'Lab 04 - Bloco B' },
  { id: 's2', disciplineId: 'd1', dayOfWeek: 1, startTime: '08:50', endTime: '10:20', room: 'Lab 04 - Bloco B' },
  { id: 's3', disciplineId: 'd5', dayOfWeek: 1, startTime: '10:30', endTime: '12:00', room: 'Lab 01 - Bloco A' },

  // Terça-feira (2)
  { id: 's4', disciplineId: 'd6', dayOfWeek: 2, startTime: '07:00', endTime: '08:30', room: 'Sala 105' },
  { id: 's5', disciplineId: 'd5', dayOfWeek: 2, startTime: '08:50', endTime: '10:20', room: 'Lab 01 - Bloco A' },
  { id: 's6', disciplineId: 'd2', dayOfWeek: 2, startTime: '10:30', endTime: '12:00', room: 'Lab 03' },

  // Quarta-feira (3)
  { id: 's7', disciplineId: 'd6', dayOfWeek: 3, startTime: '07:00', endTime: '08:30', room: 'Sala 105' },
  { id: 's8', disciplineId: 'd6', dayOfWeek: 3, startTime: '08:50', endTime: '10:20', room: 'Sala 105' },
  { id: 's9', disciplineId: 'd2', dayOfWeek: 3, startTime: '10:30', endTime: '12:00', room: 'Lab 03' },

  // Quinta-feira (4)
  { id: 's10', disciplineId: 'd3', dayOfWeek: 4, startTime: '07:00', endTime: '08:30', room: 'Lab 02 - Bloco A' },
  { id: 's11', disciplineId: 'd3', dayOfWeek: 4, startTime: '08:50', endTime: '10:20', room: 'Lab 02 - Bloco A' },

  // Sexta-feira (5)
  { id: 's12', disciplineId: 'd4', dayOfWeek: 5, startTime: '10:30', endTime: '12:00', room: 'Auditório 02' },
];

const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Implementação de Árvores AVL',
    disciplineId: 'd1',
    dueDate: 'Amanhã, 23:59',
    completed: false,
    type: 'trabalho',
  },
  {
    id: 't2',
    title: 'Plano de Testes Unitários (Jest)',
    disciplineId: 'd2',
    dueDate: '15/08, 18:00',
    completed: false,
    type: 'trabalho',
  },
  {
    id: 't3',
    title: 'Arquitetura Spring Boot & Microserviços',
    disciplineId: 'd3',
    dueDate: '18/08, 22:00',
    completed: false,
    type: 'trabalho',
  },
  {
    id: 't4',
    title: 'Proposta do Projeto de Sistemas',
    disciplineId: 'd4',
    dueDate: '22/08, 12:00',
    completed: false,
    type: 'atividade',
  },
  {
    id: 't5',
    title: 'Estudo Dirigido: Escalonamento de Processos',
    disciplineId: 'd5',
    dueDate: '25/08, 10:00',
    completed: false,
    type: 'atividade',
  },
  {
    id: 't6',
    title: 'Cronograma EAP e Matriz RACI',
    disciplineId: 'd6',
    dueDate: '28/08, 23:59',
    completed: false,
    type: 'trabalho',
  },
];

export const useCampusStore = create<CampusState>((set) => ({
  userName: 'Carlos Eduardo',
  matricula: '20241134040016',
  disciplines: INITIAL_DISCIPLINES,
  schedules: INITIAL_SCHEDULES,
  tasks: INITIAL_TASKS,
  exams: [],
  addDiscipline: (discipline) => set((state) => ({ disciplines: [...state.disciplines, discipline] })),
  removeDiscipline: (id) => set((state) => ({ disciplines: state.disciplines.filter(d => d.id !== id) })),
  incrementAbsence: (id) => set((state) => ({
    disciplines: state.disciplines.map(d => d.id === id ? { ...d, absences: d.absences + 1 } : d)
  })),
  decrementAbsence: (id) => set((state) => ({
    disciplines: state.disciplines.map(d => d.id === id ? { ...d, absences: Math.max(0, d.absences - 1) } : d)
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
