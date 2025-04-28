import { useLocation, useNavigate, Navigate } from 'react-router-dom';

type State = {
  success: boolean;
  serviceId?: string;
  totalAmount?: number;
};

export default function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as State | undefined;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { success, serviceId, totalAmount } = state;

  if (success && (!serviceId || !totalAmount)) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <div className="thank-you-page">
      {success ? (
        <>
          <h1>Ačiū už užsakymą!</h1>
          <p>
            Užsakymo numeris: <strong>{serviceId}</strong>
          </p>
          <p>
            Bendra suma: <strong>{totalAmount} €</strong>
          </p>
          <button onClick={() => navigate('/')}>Grįžti į pradžią</button>
        </>
      ) : (
        <>
          <h1>Kažkas nepavyko 😕</h1>
          <p>Mokėjimas nebuvo sėkmingas. Pabandykite dar kartą.</p>
          <button onClick={() => navigate(-1)}>
            Grįžti ir apmokėti iš naujo
          </button>
        </>
      )}
    </div>
  );
}
