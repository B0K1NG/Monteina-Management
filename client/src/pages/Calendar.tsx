import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/pages/_calendar.scss';

const availableTimes = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30'
];

const getWeekDays = (startDate: Date) => {
  const days = [];
  const today = new Date();
  for (let i = -1; i < 6; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push({
      fullDate: date.toISOString().split('T')[0],
      dayNumber: date.getDate(),
      dayName: date.toLocaleDateString('lt-LT', { weekday: 'short' }),
      isPast: date.getTime() < today.setHours(0, 0, 0, 0),
    });
  }
  return days;
};

export default function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [carCount, setCarCount] = useState(1);
  const [selectedServices, setSelectedServices] = useState<{ [key: string]: string | boolean }>({});
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [weekStart, setWeekStart] = useState(new Date());
  const navigate = useNavigate();

  const weekDays = getWeekDays(weekStart);

  useEffect(() => {
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services');
        setServices(response.data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };
    fetchServices();
  }, []);

  const handleServiceChange = (carIndex: number, service: string) => {
    setSelectedServices(prev => ({ ...prev, [carIndex]: service }));
  };

  const isBookingValid =
    selectedDate &&
    selectedTime &&
    [...Array(carCount)].every((_, index) =>
      typeof selectedServices[index] === 'string' && selectedServices[index] !== ''
    );

  const handleConfirm = () => {
    if (isBookingValid) navigate('/');
  };

  const getFilteredTimes = () => {
    const today = new Date().toISOString().split('T')[0];
    if (!selectedDate) return availableTimes;
    if (selectedDate !== today) return availableTimes;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return availableTimes.filter(time => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m > currentTime;
    });
  };

  const times = getFilteredTimes();

  return (
    <div className="booking-page">
      <section className="calendar-section">
        <h2 className='calendar-title'>Pasirinkite laiką ir paslaugą</h2>
        <input
          type="date"
          value={selectedDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ display: 'none' }}
        />

        <div className="calendar-header">
          <div className="month-label">
            {new Date(weekStart).toLocaleDateString('lt-LT', {
              year: 'numeric',
              month: 'long',
            })}
          </div>
        </div>

        <div className="week-days-wrapper">
          <button
            className="arrow-btn"
            onClick={() => {
              const prev = new Date(weekStart);
              prev.setDate(prev.getDate() - 7);
              if (prev >= new Date(new Date().setHours(0, 0, 0, 0))) setWeekStart(prev);
            }}
            disabled={weekStart <= new Date(new Date().setHours(0, 0, 0, 0))}
          >
            &lt;
          </button>

          <div className="week-days">
            {weekDays.map((day) => (
              <div
                key={day.fullDate}
                className={`day-circle ${selectedDate === day.fullDate ? 'selected' : ''} ${day.isPast ? 'disabled' : ''}`}
                onClick={() => {
                    if (!day.isPast) {
                      setSelectedDate(day.fullDate);
                      setSelectedTime(null);
                    }
                  }}
              >
                <div className="day-name">{day.dayName}</div>
                <div className="day-number">{day.dayNumber}</div>
              </div>
            ))}
          </div>

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

        <div className={`time-slots ${times.length === 0 ? 'empty' : ''}`}>
          {times.length > 0 ? (
            times.map(time => (
              <div
                key={time}
                className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </div>
            ))
          ) : (
            <div className="empty">Nėra laisvų laikų</div>
          )}
        </div>

        <button
          className="confirm-button"
          onClick={handleConfirm}
          disabled={!isBookingValid}
        >
          Patvirtinti paslaugą
        </button>
      </section>

      <section className="booking-section">
        <div className="car-section-wrapper">
          <div className="car-count-box">
            <h2>Automobilių kiekis</h2>
            <div className="car-count-selector">
              <button onClick={() => setCarCount(c => Math.max(1, c - 1))}>-</button>
              <span>{carCount}</span>
              <button onClick={() => setCarCount(c => c + 1)}>+</button>
            </div>
          </div>

          {[...Array(carCount)].map((_, index) => (
            <div key={index} className="car-service-box">
              <label>Automobilis {index + 1}</label>
              <select
                value={typeof selectedServices[index] === 'string' ? selectedServices[index] : ''}
                onChange={(e) => handleServiceChange(index, e.target.value)}
              >
                <option value="">Pasirinkite paslaugą</option>
                {services.map(service => (
                  <option key={service.id} value={service.name}>{service.name}</option>
                ))}
              </select>

              <div className="optional-service">
                <input
                  type="checkbox"
                  checked={!!selectedServices[`ventiliu-${index}`]}
                  onChange={(e) =>
                    setSelectedServices(prev => ({
                      ...prev,
                      [`ventiliu-${index}`]: e.target.checked,
                    }))
                  }
                />
                <span>Reikalingas ventilių keitimas</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
