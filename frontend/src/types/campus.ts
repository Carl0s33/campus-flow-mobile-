export interface Discipline {
  id: string;
  name: string;
  code?: string;
  teacher?: string;
  color: string;
  absences: number;
  workload: number;
  period?: number;
  grades?: {
    n1?: number;
    n2?: number;
  };
}

export interface Schedule {
  id: string;
  disciplineId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
}

export interface Task {
  id: string;
  title: string;
  disciplineId: string;
  dueDate: string;
  completed: boolean;
  type: 'trabalho' | 'atividade';
}

export interface Exam {
  id: string;
  title: string;
  disciplineId: string;
  date: string;
  time: string;
  topics?: string;
}
