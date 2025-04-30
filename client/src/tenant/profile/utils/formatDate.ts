export const formatISODate = (iso: string): string =>
    new Date(iso).toISOString().split('T')[0];
  