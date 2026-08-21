import { Platform } from 'react-native';
import { Discipline, Schedule, Task, Exam } from '@/types/campus';

// URL base da API configurável via variável de ambiente ou detecção automática de plataforma
const getBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // No emulador Android padrão, localhost do computador hospedeiro é 10.0.2.2
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api';
  }
  
  // iOS Simulator e Web usam localhost:8080
  return 'http://localhost:8080/api';
};

export const API_BASE_URL = getBaseUrl();

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options?.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Erro na requisição: ${response.status} ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson.message) errorMessage = errorJson.message;
      else if (errorJson.error) errorMessage = errorJson.error;
    } catch {
      // Ignora erro de parse se o corpo não for JSON
    }
    throw new Error(errorMessage);
  }

  // Tratamento de respostas vazias (ex: 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// -------------------------------------------------------------
// SERVIÇO DE DISCIPLINAS
// -------------------------------------------------------------
export interface DisciplineDTO {
  id?: string;
  name: string;
  code?: string;
  teacher?: string;
  color?: string;
  absences?: number;
  workload?: number;
  period?: number;
  n1?: number;
  n2?: number;
  recoveryGrade?: number;
  pomodoroCount?: number;
  finalGrade?: number;
  statusText?: string;
  statusColor?: string;
  isApproved?: boolean;
  inRecovery?: boolean;
}

export const disciplineApi = {
  getAll: () => request<DisciplineDTO[]>('/disciplines'),
  getById: (id: string) => request<DisciplineDTO>(`/disciplines/${id}`),
  create: (data: Omit<DisciplineDTO, 'id'>) =>
    request<DisciplineDTO>('/disciplines', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<DisciplineDTO>) =>
    request<DisciplineDTO>(`/disciplines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateAbsences: (id: string, absences: number) =>
    request<DisciplineDTO>(`/disciplines/${id}/absences`, {
      method: 'PATCH',
      body: JSON.stringify({ absences }),
    }),
  updateGrades: (id: string, n1?: number, n2?: number, recoveryGrade?: number) =>
    request<DisciplineDTO>(`/disciplines/${id}/grades`, {
      method: 'PATCH',
      body: JSON.stringify({ n1, n2, recoveryGrade }),
    }),
  delete: (id: string) =>
    request<void>(`/disciplines/${id}`, {
      method: 'DELETE',
    }),
  incrementPomodoro: (id: string) =>
    request<DisciplineDTO>(`/disciplines/${id}/pomodoro`, {
      method: 'PATCH',
    }),
};

// -------------------------------------------------------------
// SERVIÇO DE HORÁRIOS (SCHEDULES)
// -------------------------------------------------------------
export interface ScheduleDTO {
  id?: string;
  disciplineId: string;
  disciplineName?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
}

export const scheduleApi = {
  getAll: (dayOfWeek?: number) => {
    const query = dayOfWeek !== undefined ? `?dayOfWeek=${dayOfWeek}` : '';
    return request<ScheduleDTO[]>(`/schedules${query}`);
  },
  create: (data: Omit<ScheduleDTO, 'id' | 'disciplineName'>) =>
    request<ScheduleDTO>('/schedules', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/schedules/${id}`, {
      method: 'DELETE',
    }),
};

// -------------------------------------------------------------
// SERVIÇO DE TAREFAS (TASKS)
// -------------------------------------------------------------
export interface TaskDTO {
  id?: string;
  title: string;
  description?: string;
  dueDate: string;
  type?: string;
  priority?: string;
  completed?: boolean;
  disciplineId: string;
  disciplineName?: string;
  pomodoroCount?: number;
}

export const taskApi = {
  getAll: (disciplineId?: string) => {
    const query = disciplineId ? `?disciplineId=${disciplineId}` : '';
    return request<TaskDTO[]>(`/tasks${query}`);
  },
  getById: (id: string) => request<TaskDTO>(`/tasks/${id}`),
  create: (data: Omit<TaskDTO, 'id' | 'disciplineName'>) =>
    request<TaskDTO>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  toggle: (id: string) =>
    request<TaskDTO>(`/tasks/${id}/toggle`, {
      method: 'PATCH',
    }),
  update: (id: string, data: Partial<TaskDTO>) =>
    request<TaskDTO>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    }),
  incrementPomodoro: (id: string) =>
    request<TaskDTO>(`/tasks/${id}/pomodoro`, {
      method: 'PATCH',
    }),
};

// -------------------------------------------------------------
// SERVIÇO DE PROVAS (EXAMS)
// -------------------------------------------------------------
export interface ExamDTO {
  id?: string;
  disciplineId: string;
  disciplineName?: string;
  title: string;
  date: string;
  time?: string;
  topics?: string;
  location?: string;
}

export const examApi = {
  getAll: () => request<ExamDTO[]>('/exams'),
  create: (data: Omit<ExamDTO, 'id' | 'disciplineName'>) =>
    request<ExamDTO>('/exams', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<void>(`/exams/${id}`, {
      method: 'DELETE',
    }),
};

// -------------------------------------------------------------
// SERVIÇO DE HEALTHCHECK
// -------------------------------------------------------------
export const healthApi = {
  check: () => request<{ status: string; timestamp: string }>('/health'),
};
