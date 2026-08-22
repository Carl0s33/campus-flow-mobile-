import { Schedule } from '@/types/campus';

export interface MergedSchedule extends Omit<Schedule, 'id'> {
  id: string;
  originalIds: string[];
  isMerged: boolean;
  midTimes: string[]; // To show dashed lines
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function mergeSequentialSchedules(schedules: Schedule[]): MergedSchedule[] {
  if (schedules.length === 0) return [];

  // Assuming schedules are already sorted by startTime
  const sorted = [...schedules].sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  const merged: MergedSchedule[] = [];
  let current: MergedSchedule = {
    ...sorted[0],
    originalIds: [sorted[0].id],
    isMerged: false,
    midTimes: [],
  };

  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i];
    
    const currentEndMin = timeToMinutes(current.endTime);
    const nextStartMin = timeToMinutes(next.startTime);
    
    // Consider sequential if difference is <= 30 mins and same discipline
    if (current.disciplineId === next.disciplineId && (nextStartMin - currentEndMin) <= 30) {
      current.endTime = next.endTime;
      current.originalIds.push(next.id);
      current.isMerged = true;
      current.midTimes.push(next.startTime);
    } else {
      merged.push(current);
      current = {
        ...next,
        originalIds: [next.id],
        isMerged: false,
        midTimes: [],
      };
    }
  }
  
  merged.push(current);
  return merged;
}
