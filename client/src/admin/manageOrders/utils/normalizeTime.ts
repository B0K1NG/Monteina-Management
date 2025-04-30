export function normalizeTime(time: string): string {
  const [h, m] = time.split(':');
  return `${h.padStart(2, '0')}:${m}`;
}
