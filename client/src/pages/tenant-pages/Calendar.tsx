import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { availableTimes } from '../../tenant/calendar/utils/constants';
import { getWeekDays } from '../../tenant/calendar/utils/dateUtils';
import { CarDetails } from '../../tenant/calendar/types';
import { useCarMakesModels } from '../../tenant/calendar/hooks/useCarMakesModels';
import useServices from '../../tenant/calendar/hooks/useServices';
import { useBookedTimes } from '../../tenant/calendar/hooks/useBookedTimes';
import CalendarHeader from '../../tenant/calendar/components/CalendarHeader';
import WeekDays from '../../tenant/calendar/components/WeekDays';
import TimeSlots from '../../tenant/calendar/components/TimeSlots';
import CarDetailsForm from '../../tenant/calendar/components/CarDetailsForm';
import ServiceOptionsForm from '../../tenant/calendar/components/ServiceOptionsForm';
import { toast } from 'react-toastify';

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayTimestamp = todayStart.getTime();

  const [weekStart, setWeekStart] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string>('');
  const [carDetails, setCarDetails] = useState<CarDetails>({
    make: '', model: '', year: '', tireSize: '', tireQuantity: ''
  });
  const [repairOption, setRepairOption] = useState<string | null>(null);
  const [valveChange, setValveChange] = useState(false);

  const { makes, models, fetchModels } = useCarMakesModels();
  const { services } = useServices();
  const bookedTimes = useBookedTimes(selectedDate);

  useEffect(() => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, []);

  const weekDays = getWeekDays(weekStart);

  const times = (() => {
    const todayStr = new Date().toISOString().split('T')[0];
    let arr = [...availableTimes];
    if (selectedDate === todayStr) {
      const now = new Date();
      const min = now.getHours() * 60 + now.getMinutes();
      arr = arr.filter(t => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m > min;
      });
    }
    return arr;
  })();

  const isBookingValid =
    selectedDate &&
    selectedTime &&
    carDetails.make &&
    carDetails.model &&
    carDetails.year &&
    carDetails.tireSize &&
    carDetails.tireQuantity &&
    selectedService &&
    (selectedService !== 'Padangos remontas' || Boolean(repairOption));

  const handleConfirm = () => {
    if (!isBookingValid) {
      toast.error('Prašome užpildyti visus laukus prieš patvfrtinant paslaugą.');
      return;
    }
    const details = {
      date: selectedDate,
      time: selectedTime!,
      carDetails,
      selectedService: {
        name: selectedService!,
        price_min: services.find(s => s.name === selectedService!)?.price_min || 0,
        price_max: services.find(s => s.name === selectedService!)?.price_max || 0
      },
      valveChange,
      tireQuantity: parseInt(carDetails.tireQuantity, 10),
      repairOption
    };
    localStorage.setItem('bookingDetails', JSON.stringify(details));
    navigate('/checkout');
  };

  return (
    <div className="booking-page">
      <section className="calendar-section">
        <h2 className="calendar-title">Pasirinkite laiką ir paslaugą</h2>

        <CalendarHeader
          monthLabel={new Date(weekStart).toLocaleDateString('lt-LT', {
            year: 'numeric',
            month: 'long'
          })}
        />

        <div className="week-days-wrapper">
          <button
            className="arrow-btn"
            onClick={() => {
              const prev = new Date(weekStart);
              prev.setDate(prev.getDate() - 7);
              if (prev.getTime() >= todayTimestamp) setWeekStart(prev);
            }}
            disabled={weekStart.getTime() <= todayTimestamp}
          >
            &lt;
          </button>

          <WeekDays
            days={weekDays}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />

          <button
            className="arrow-btn"
            onClick={() => {
              const next = new Date(weekStart);
              next.setDate(next.getDate() + 7);
              setWeekStart(next);
            }}
          >
            &gt;
          </button>
        </div>

        <TimeSlots
          times={times}
          selectedTime={selectedTime}
          bookedTimes={bookedTimes}
          onSelect={setSelectedTime}
        />

        <button
          className="confirm-button"
          onClick={handleConfirm}
          disabled={!isBookingValid}
        >
          Patvirtinti paslaugą
        </button>
      </section>

      <section className="booking-section">
        <div className="car-service-box">
          <div className="car-service-box-information-box">
            <h3 className="car-service-title">Automobilio duomenys</h3>
            <CarDetailsForm
              carDetails={carDetails}
              makes={makes}
              models={models}
              fetchModels={fetchModels}
              onChange={(f, v) => setCarDetails(cd => ({ ...cd, [f]: v }))}
            />
          </div>

          <ServiceOptionsForm
            services={services}
            selectedService={selectedService}
            onServiceChange={setSelectedService}
            tireQuantityVal={carDetails.tireQuantity}
            onQuantityChange={v =>
              setCarDetails(cd => ({ ...cd, tireQuantity: v }))
            }
            repairOption={repairOption}
            onRepairChange={setRepairOption}
            valveChange={valveChange}
            onValveChange={setValveChange}
          />
        </div>
      </section>
    </div>
  );
};

export default CalendarPage;