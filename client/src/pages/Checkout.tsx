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
  repairOption?: 'ventiliu-keitimas' | 'siulo-iverimas' | 'lopas';
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
    repairOption,
  } = bookingDetails;

  const mainServicePrice =
    selectedService.name === 'Padangos remontas'
      ? (repairOption === 'lopas'
          ? selectedService.price_max
          : selectedService.price_min)
      : (carDetails.tireSize.startsWith('R18')
          ? selectedService.price_max
          : selectedService.price_min);
          
  const groupRepairCount = repairOption ? Math.ceil(tireQuantity / 4) : tireQuantity;
  const valvePrice = valveChange ? 5 : 0;
  const advanceAmount = 5;
  const totalAmount =
    (repairOption
      ? mainServicePrice * groupRepairCount + valvePrice
      : mainServicePrice * tireQuantity + valvePrice);
  const remaining = totalAmount - advanceAmount;
  const serviceId = `MONT${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-001`;

  const handlePayment = async () => {
    const token = localStorage.getItem('token')!;
    const decoded = jwtDecode<MyJwtPayload>(token);
    const userId = decoded?.id;
    if (!userId) {
      console.error('User ID not found in token');
      return navigate('/confirmation', { state: { success: false } });
    }

    const payload = {
      paymentStatus: 'success',
      // paymentStatus: 'not-success',
      userId,
      bookingDate: date,
      bookingTime: time,
      carDetails,
      selectedService,
      valveChange,
      tireQuantity,
      repairOption,
      serviceId,
      totalAmount,
      advanceAmount,
      remainingAmount: remaining,
    };

    try {
      const res = await axios.post('/api/checkout', payload);

      if (res.status === 200) {
        localStorage.removeItem('bookingDetails');
        navigate('/confirmation', {
          state: { success: true, serviceId, totalAmount, advanceAmount, bookingDate: date, bookingTime: time },
        });
      } else {
        console.error('Payment failed:', res.data);
        navigate('/confirmation', { state: { success: false } });
      }
    } catch (err) {
      console.error('Error during payment:', err);
      navigate('/confirmation', { state: { success: false } });
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-details">
          <button
            className="checkout-back-button"
            onClick={() => {
              localStorage.removeItem('bookingDetails');
              navigate('/calendar');
            }}
          >
            Atgal
          </button>
          <h2 className="checkout-header">Užsakymo suvestinė</h2>
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
          <div className="checkout-date">
            <span>{time}</span>
            <span>{date}</span>
          </div>
          <hr className="separation-line" />
          <h2 className="checkout-subheader">Santrauka</h2>
          <div className="summary-item">
            <span>Užsakymo numeris</span>
            <span>{serviceId}</span>
          </div>
          <div className="summary-item">
            <span>{selectedService.name}</span>
            <span>{mainServicePrice} €</span>
          </div>
          {selectedService.name === 'Padangos remontas' && repairOption && (
            <div className="summary-item">
              <span>Remonto tipas</span>
              <span>{
                repairOption === 'ventiliu-keitimas' ? 'Ventilių keitimas'
                : repairOption === 'siulo-iverimas'  ? 'Siūlo įvėrimas'
                                                  : 'Lopo dėjimas'
              }</span>
            </div>
          )}
          {valveChange && (
            <div className="summary-item">
              <span>Ventilių keitimo kaina</span>
              <span>{valvePrice} €</span>
            </div>
          )}
          <hr className="separation-line" />
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
          <hr className="separation-line" />
          <button className="pay-button" onClick={handlePayment}>
            Apmokėti
          </button>
          <div className="checkout-terms">
            <p>
              Paspaudę "Apmokėti" sutinkate su mūsų <a href="/terms">paslaugų teikimo sąlygomis.</a>
            </p>
            <p>
              Automobiliai kurių varžtų nebus įmanoma atsukti nebus aptarnaujami
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}