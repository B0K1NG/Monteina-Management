import { Booking } from '../types';

interface Props {
  booking: Booking;
  onClose(): void;
  onConfirm(): void;
}

export default function ConfirmChangesModal({ booking, onClose, onConfirm }: Props) {
  return (
    <div className="confirm-modal">
      <div className="confirm-modal-content">
        <h2>Koreguoti užsakymą</h2>
        <p>Ar jūs esate įsitikines, kad visi pakeitimai yra teisingi?</p>
        <p><strong>Užsakymo ID:</strong> {booking.id}</p>
        <p><strong>Klientas:</strong> {booking.userName}</p>
        <p><strong>Paslauga:</strong> {booking.serviceName}</p>
        <p><strong>Data:</strong> {booking.bookingDate}</p>
        <div className="modal-buttons">
          <button onClick={onClose} className="btn btn--secondary cancel-button">Atgal</button>
          <button onClick={onConfirm} className="btn btn--primary suceed-button">Patvirtinti</button>
        </div>
      </div>
    </div>
  );
}