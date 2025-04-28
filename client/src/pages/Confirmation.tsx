import { useLocation, useNavigate, Navigate } from 'react-router-dom';

import successImage from '../assets/icons/success.png';
import unsuccessImage from '../assets/icons/unsuccess.png';

type State = {
  success: boolean;
  serviceId?: string;
  totalAmount?: number;
  advanceAmount?: number;
  bookingDate?: string;
  bookingTime?: string;
};

export default function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as State | undefined;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const {
    success,
    serviceId,
    totalAmount,
    advanceAmount,
    bookingDate,
    bookingTime,
  } = state;

  if (success && (!serviceId || !totalAmount)) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <div className={`confirmation-page ${success ? '' : 'confirmation-page--failure'}`}>
      <div className="confirmation-container">
        {success ? (
          <>
            <img
              src={successImage}
              alt="Sėkmingai!"
              className="confirmation-image"
            />
            <h1 className="confirmation-title">Mokėjimas sėkmingas</h1>
            <p className="confirmation-message">
              Ačiū. Jūsų rezervacija patvirtinta
            </p>
            <hr className="separation-line" />
            <p className="confirmation-detail">
              Užsakymo numeris{' '}
              <span>{serviceId}</span>
            </p>
            <p className="confirmation-detail">
              Data{' '}
              <span className="confirmation-date">{bookingDate} {bookingTime}</span>
            </p>
            <hr className="separation-line" />
            <p className="confirmation-detail">
              Užsakymo suma{' '}
              <span>{totalAmount} €</span>
            </p>
            <p className="confirmation-detail">
              Apmokėtas avansas{' '}
              <span>{advanceAmount} €</span>
            </p>
            <button
              className="confirmation-button"
              onClick={() => navigate('/')}
            >
              Grįžti į pagrindinį puslapį
            </button>
          </>
        ) : (
          <>
            <img
              src={unsuccessImage}
              alt="Nesėkmingai!"
              className="confirmation-image"
            />
            <h1 className="confirmation-title">Mokėjimas nepavyko</h1>
            <p className="confirmation-message">
              Mokėjimas nebuvo sėkmingas. Pabandykite dar kartą.
            </p>
            <button
              className="confirmation-button"
              onClick={() => navigate(-1)}
            >
              Grįžti ir apmokėti iš naujo
            </button>
          </>
        )}
      </div>
    </div>
  );
}
