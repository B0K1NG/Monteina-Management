import { Day } from '../types';

export const normalizeTime = (time: string) => {
  const [h, m] = time.split(':');
  return `${h.padStart(2, '0')}:${m}`;
};

export const getWeekDays = (startDate: Date): Day[] => {
  const days: Day[] = [];
  const today = new Date().setHours(0, 0, 0, 0);

  for (let i = -1; i < 6; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    days.push({
      fullDate: d.toISOString().split('T')[0],
      dayNumber: d.getDate(),
      dayName: d.toLocaleDateString('lt-LT', { weekday: 'short' }),
      isPast: d.getTime() < today,
    });
  }

  return days;
};