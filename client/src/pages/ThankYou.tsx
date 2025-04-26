import { useLocation, useNavigate, Navigate } from 'react-router-dom';

export default function ThankYou() {
  const location = useLocation();
  const navigate = useNavigate();
  const { serviceId, totalAmount } = location.state || {};

  if (!serviceId || !totalAmount) {
    return <Navigate to="/not-found" />;
  }

  return (
    <div className="thank-you-page">
      <h1>Ačiū už užsakymą!</h1>
      <p>Užsakymo numeris: <strong>{serviceId}</strong></p>
      <p>Bendra suma: <strong>{totalAmount} €</strong></p>
      <button onClick={() => navigate('/')}>Grįžti į pradžią</button>
    </div>
  );
}