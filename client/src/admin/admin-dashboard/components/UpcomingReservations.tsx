import { Booking } from '../types';
import { normalizeDate } from '../utils/dateUtils';

interface Props {
  bookings: Booking[];
}

export default function UpcomingReservations({ bookings }: Props) {
  const activeBookings = bookings.filter(b => b.status === 'active');

  return (
    <div className="upcoming-reservations">
      <h2>Artėjančios rezervacijos</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th><th>Laikas</th><th>Klientas</th><th>Paslauga</th>
          </tr>
        </thead>
        <tbody>
          {activeBookings.slice(0, 6).map(b => (
            <tr key={b.id}>
              <td>{normalizeDate(b.bookingDate)}</td>
              <td>{b.bookingTime}</td>
              <td>{b.userName || 'N/A'}</td>
              <td>{b.serviceName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}