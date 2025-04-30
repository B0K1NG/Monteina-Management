import React from 'react';
import successImage from '../../../assets/icons/success.png';
import { ConfirmationState } from '../types';

interface Props {
  state: ConfirmationState;
  onBack: () => void;
}

const SuccessView: React.FC<Props> = ({ state, onBack }) => {
  const { serviceId, bookingDate, bookingTime, totalAmount, advanceAmount } = state;

  return (
    <>
      <img src={successImage} alt="Sėkmingai!" className="confirmation-image" />
      <h1 className="confirmation-title">Mokėjimas sėkmingas</h1>
      <p className="confirmation-message">Ačiū. Jūsų rezervacija patvirtinta</p>
      <hr className="separation-line" />
      <p className="confirmation-detail">
        Užsakymo numeris <span>{serviceId}</span>
      </p>
      <p className="confirmation-detail">
        Data <span className="confirmation-date">{bookingDate} {bookingTime}</span>
      </p>
      <hr className="separation-line" />
      <p className="confirmation-detail">
        Užsakymo suma <span>{totalAmount} €</span>
      </p>
      <p className="confirmation-detail">
        Apmokėtas avansas <span>{advanceAmount} €</span>
      </p>
      <button className="confirmation-button" onClick={onBack}>
        Grįžti į pagrindinį puslapį
      </button>
    </>
  );
};

export default SuccessView;