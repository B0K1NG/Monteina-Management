interface Props {
  onConfirm(): void;
  onClose(): void;
}

export default function CancelModal({ onConfirm, onClose }: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Atšaukti vizitą</h2>
        <p>
          Ar jūs esate įsitikinęs, kad norite atšaukti savo vizitą? (Avansas
          nėra grąžinamas)
        </p>
        <div className="modal-buttons">
          <button
            className="btn btn--secondary cancel-button"
            onClick={onClose}
          >
            Uždaryti
          </button>
          <button
            className="btn btn--danger confirm-button"
            onClick={onConfirm}
          >
            Atšaukti vizitą
          </button>
        </div>
      </div>
    </div>
  );
}
