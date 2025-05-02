import { Visit } from '../types';
import { formatISODate } from '../utils/formatDate';

interface Props {
  invoice: Visit;
  onClose(): void;
}

export default function InvoiceModal({ invoice, onClose }: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Sąskaitos informacija</h2>
        <div className="modal-grid">
        <p>
          <strong>Data:</strong> {formatISODate(invoice.bookingDate)}
        </p>
        <p>
          <strong>Paslauga:</strong> {invoice.serviceName}
        </p>
        <p>
          <strong>Suma:</strong> {invoice.totalAmount} €
        </p>
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
