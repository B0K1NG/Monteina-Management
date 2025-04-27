import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { jwtDecode } from 'jwt-decode';

interface MyJwtPayload {
  id: string;
  iat: number;
  exp: number;
}

type BookingDetails = {
  date: string;
  time: string;
  carDetails: {
    make: string;
    model: string;
    tireSize: string;
  };
  selectedService: {
    name: string;
    price_min: number;
    price_max: number;
  };
  valveChange: boolean;
  tireQuantity: number;
};

export default function Checkout() {
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('bookingDetails');
    if (!stored) {
      setTimeout(() => navigate('/calendar'), 0);
    } else {
      setBookingDetails(JSON.parse(stored));
    }
  }, [navigate]);

  if (!bookingDetails) {
    navigate('/calendar');
    return null;
  }

  const {
    date,
    time,
    carDetails,
    selectedService,
    valveChange,
    tireQuantity,
  } = bookingDetails;

  const mainServicePrice = carDetails.tireSize.startsWith('R18')
    ? selectedService.price_max
    : selectedService.price_min;

  const valvePrice    = valveChange ? 5 : 0;
  const advanceAmount = 5;
  const totalAmount   = mainServicePrice * tireQuantity + valvePrice;
  const remaining     = totalAmount - advanceAmount;
  const serviceId     = `MONT${new Date().toISOString().slice(0,10).replace(/-/g,'')}-001`;

  const handlePayment = async () => {
    const token   = localStorage.getItem('token')!;
    const decoded = jwtDecode<MyJwtPayload>(token);
    const userId  = decoded?.id;
    if (!userId) {
      console.error('User ID not found in token');
      return;
    }

    const payload = {
      userId,
      bookingDate: date,
      bookingTime: time,
      carDetails,
      selectedService,
      valveChange,
      tireQuantity,
      serviceId,
      totalAmount,
      advanceAmount,
      remainingAmount: remaining,
    };

    try {
      const res = await axios.post('/api/checkout', payload);
      if (res.status === 200) {
        localStorage.removeItem('bookingDetails');
        navigate('/thank-you', { state: { serviceId, totalAmount } });
      } else {
        console.error('Payment failed:', res.data);
      }
    } catch (err) {
      console.error('Error during payment:', err);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-details">
          <h2>Užsakymo suvestinė</h2>
          <div className="detail-item">
            <span>Data</span>
            <span>{date}</span>
          </div>
          <div className="detail-item">
            <span>Laikas</span>
            <span>{time}</span>
          </div>
          <div className="detail-item">
            <span>Automobilis</span>
            <span>{carDetails.make} {carDetails.model}</span>
          </div>
          <div className="detail-item">
            <span>Ratų išmatavimai</span>
            <span>{carDetails.tireSize}</span>
          </div>
          <div className="detail-item">
            <span>Ratų kiekis</span>
            <span>{tireQuantity}</span>
          </div>
        </div>

        <div className="checkout-summary">
          <h2>Santrauka</h2>
          <div className="summary-item">
            <span>Užsakymo numeris</span>
            <span>{serviceId}</span>
          </div>
          <div className="summary-item">
            <span>Paslauga</span>
            <span>{selectedService.name} — {mainServicePrice} €</span>
          </div>
          {valveChange && (
            <div className="summary-item">
              <span>Ventilių keitimas</span>
              <span>{valvePrice} €</span>
            </div>
          )}
          <div className="summary-item">
            <span>Užsakymo suma</span>
            <span>{totalAmount} €</span>
          </div>
          <div className="summary-item">
            <span>Avansas</span>
            <span>{advanceAmount} €</span>
          </div>
          <div className="summary-item">
            <span>Likusi suma po avanso</span>
            <span>{remaining} €</span>
          </div>
          <button className="pay-button" onClick={handlePayment}>
            Apmokėti
          </button>
          <button
            className="back-button"
            onClick={() => {
              localStorage.removeItem('bookingDetails');
              navigate('/calendar');
            }}
          >
            Grįžti
          </button>
        </div>
      </div>
    </div>
  );
}