export function formatDueDate(isoString: string): string {
  try {
    const dueDate = new Date(isoString);
    if (isNaN(dueDate.getTime())) return isoString; // fallback to original se inválido

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);

    const timeDiff = taskDate.getTime() - today.getTime();
    const daysDiff = Math.round(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) return 'Atrasado';
    if (daysDiff === 0) return 'Hoje';
    if (daysDiff === 1) return 'Amanhã';

    // Format like '15/08'
    const day = String(taskDate.getDate()).padStart(2, '0');
    const month = String(taskDate.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  } catch (e) {
    return isoString;
  }
}

export function isDueToday(isoString: string): boolean {
  try {
    const dueDate = new Date(isoString);
    const today = new Date();
    return dueDate.getDate() === today.getDate() &&
           dueDate.getMonth() === today.getMonth() &&
           dueDate.getFullYear() === today.getFullYear();
  } catch (e) {
    return false;
  }
}

export function calculateClassProgress(startTime: string, endTime: string): number {
  try {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (currentMinutes < startMinutes) return 0;
    if (currentMinutes > endMinutes) return 100;

    const totalDuration = endMinutes - startMinutes;
    const elapsed = currentMinutes - startMinutes;
    
    return Math.round((elapsed / totalDuration) * 100);
  } catch (e) {
    return 0;
  }
}
