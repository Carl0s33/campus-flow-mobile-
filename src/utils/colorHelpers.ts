import { MATTE_COLORS } from '@/constants/theme';

export function generateDisciplineColor(id: string): string {
  if (!id) return MATTE_COLORS[0];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % MATTE_COLORS.length;
  return MATTE_COLORS[colorIndex];
}
