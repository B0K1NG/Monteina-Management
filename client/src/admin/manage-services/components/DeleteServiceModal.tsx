import { Service } from '../types';

interface Props {
  service: Service;
  onCancel(): void;
  onConfirm(): void;
}

export default function DeleteServiceModal({ service, onCancel, onConfirm }: Props) {
  return (
    <div className="delete-modal">
      <div className="delete-modal-content">
        <h2>Ištrinti paslaugą</h2>
        <p>Ar jūs esate įsitikines, kad norite panaikinti šią paslaugą: "{service.name}"?</p>
        <div className="modal-buttons">
          <button onClick={onCancel} className="btn btn--secondary cancel-button">Atšaukti</button>
          <button onClick={onConfirm} className="btn btn--danger suceed-button">Pašalinti</button>
        </div>
      </div>
    </div>
  );
}
