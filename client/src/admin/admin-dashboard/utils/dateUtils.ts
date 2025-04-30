export function normalizeDate(dateStr: string): string {
    return dateStr.split('T')[0];
  }
  
  export function getDateLabel(selectedDate: string): string {
    const iso = (offset: number) =>
      new Date(Date.now() + offset * 86400000).toISOString().split('T')[0];
    const today     = iso(0);
    const tomorrow  = iso(1);
    const yesterday = iso(-1);
  
    if (selectedDate === today)     return 'Šiandiena';
    if (selectedDate === tomorrow)  return 'Rytoj';
    if (selectedDate === yesterday) return 'Vakar';
    return selectedDate;
  }  