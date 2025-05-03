export const formatISODate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('lt-LT');
};