import { Booking } from '../types';

export function calculateTotalAmount(bookings: Booking[]): string {
  const sum = bookings.reduce((acc, b) => {
    return acc + (b.status === 'canceled' ? 5 : b.totalAmount);
  }, 0);
  return sum.toFixed(2);
}

export function calculateAveragePrice(bookings: Booking[]): string {
  const nonCanceled = bookings.filter(b => b.status !== 'canceled');
  if (nonCanceled.length === 0) return '0.00';
  const sum = nonCanceled.reduce((acc, b) => acc + b.totalAmount, 0);
  return (sum / nonCanceled.length).toFixed(2);
}

export function getMostPopularService(bookings: Booking[]): string {
  const counts: Record<string, number> = {};
  bookings.forEach(b => {
    if (b.status === 'active' || b.status === 'done') {
      counts[b.serviceName] = (counts[b.serviceName] || 0) + 1;
    }
  });
  const [serv] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || [];
  return serv || 'Dar nebuvo rezervacijų';
}

export function getClosestReservation(bookings: Booking[]): string {
  const active = bookings.filter(b => b.status === 'active');
  if (active.length === 0) return 'Kol kas nėra';
  return active
    .sort((a, b) => a.bookingTime.localeCompare(b.bookingTime))[0]
    .bookingTime;
}