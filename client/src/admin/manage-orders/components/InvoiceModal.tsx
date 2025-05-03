import { Booking } from '../types';
import { formatISODate } from '../utils/formatDate';

interface Props {
  booking: Booking;
  onClose(): void;
}

export default function InvoiceModal({ booking, onClose }: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Užsakymo Sąskaitos Informacija</h2>
        <div className="modal-grid">
          <p>
            <strong>Data:</strong> {formatISODate(booking.bookingDate)}
          </p>
          <p>
            <strong>Laikas:</strong> {booking.bookingTime}
          </p>
          <p>
            <strong>Klientas:</strong> {booking.userName}
          </p>
          <p>
            <strong>Paslauga:</strong> {booking.serviceName}
          </p>
          {booking.totalAmount !== undefined && (
            <p>
              <strong>Suma:</strong> {booking.totalAmount} €
            </p>
          )}
          <div className="modal-buttons">
            <button
              className="btn btn--secondary cancel-button"
              onClick={onClose}
            >
              Uždaryti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}