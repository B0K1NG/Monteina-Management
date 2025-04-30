import { Booking } from '../types';

interface Props {
  booking: Booking;
  onClose(): void;
  onConfirm(): void;
}

export default function CancelOrderModal({ booking, onClose, onConfirm }: Props) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Atšaukti Užsakymą</h2>
        <p>
          Ar tikrai norite atšaukti užsakymą #{booking.id} ({booking.bookingDate}{' '}
          {booking.bookingTime})?
        </p>
        <div className="modal-buttons">
          <button onClick={onClose} className="btn btn--secondary">Atgal</button>
          <button onClick={onConfirm} className="btn btn--danger">Atšaukti</button>
        </div>
      </div>
    </div>
  );
}
