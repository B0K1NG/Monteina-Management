import { Booking } from '../types';

interface Props {
  booking: Booking;
  onClose(): void;
  onConfirm(): void;
}

export default function ConfirmChangesModal({ booking, onClose, onConfirm }: Props) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Patvirtinti Pakeitimus</h2>
        <p>Ar tikrai norite patvirtinti pakeitimus užsakymui?</p>
        <p><strong>Užsakymo ID:</strong> {booking.id}</p>
        <p><strong>Klientas:</strong> {booking.userName}</p>
        <p><strong>Paslauga:</strong> {booking.serviceName}</p>
        <p><strong>Data:</strong> {booking.bookingDate}</p>
        <div className="modal-buttons">
          <button onClick={onClose} className="btn btn--secondary">Atgal</button>
          <button onClick={onConfirm} className="btn btn--primary">Patvirtinti</button>
        </div>
      </div>
    </div>
  );
}