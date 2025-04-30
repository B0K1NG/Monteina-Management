import { Booking } from '../types';
import { formatISODate } from '../utils/formatDate';

interface Props {
  bookings: Booking[];
  onCancel(id: number): void;
}

export default function ActiveBookings({ bookings, onCancel }: Props) {
  return (
    <div className="profile-right panel">
      <h2 className="section-title">Ateinantis vizitas</h2>
      {bookings.length > 0 ? (
        bookings.map(b => (
          <div key={b.id} className="booking-item">
            <div className="booking-item__date">
              {formatISODate(b.bookingDate)}
            </div>
            <div className="booking-item__time">{b.bookingTime}</div>
            <button
              className="btn btn--secondary booking-item__cancel"
              onClick={() => onCancel(b.id)}
            >
              Atšaukti
            </button>
          </div>
        ))
      ) : (
        <p>Nėra ateinančių vizitų.</p>
      )}
    </div>
  );
}
