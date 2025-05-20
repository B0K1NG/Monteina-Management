import React from 'react';
import unsuccessImage from '/assets/icons/unsuccess.png';

interface Props {
  onRetry: () => void;
}

const FailureView: React.FC<Props> = ({ onRetry }) => (
  <>
    <img src={unsuccessImage} alt="Nesėkmingai!" className="confirmation-image" />
    <h1 className="confirmation-title">Mokėjimas nepavyko</h1>
    <p className="confirmation-message">
      Mokėjimas nebuvo sėkmingas. Pabandykite dar kartą.
    </p>
    <button className="confirmation-button" onClick={onRetry}>
      Grįžti ir apmokėti iš naujo
    </button>
  </>
);

export default FailureView;