import { Service } from '../types';

interface Props {
  service: Service;
  onCancel(): void;
  onConfirm(): void;
}

export default function DeleteServiceModal({ service, onCancel, onConfirm }: Props) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Patvirtinti šalinimą</h2>
        <p>Ar tikrai norite pašalinti paslaugą "{service.name}"?</p>
        <div className="modal-buttons">
          <button onClick={onCancel}>Atšaukti</button>
          <button onClick={onConfirm}>Pašalinti</button>
        </div>
      </div>
    </div>
  );
}
