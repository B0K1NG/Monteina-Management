import axios from '../api/axios';
import Dropdown from '../components/Dropdown';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMakes, getModelsForMake } from '../api/vehicles';

import '../styles/client_pages/_calendar.scss';

const availableTimes = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
];

const tireSizes = [...Array(16)].map((_, i) => `R${i + 10}`);
const tireQuantity = [...Array(100)].map((_, i) => `${i + 1} vnt.`);

const getWeekDays = (startDate: Date) => {
  const days: {
    fullDate: string;
    dayNumber: number;
    dayName: string;
    isPast: boolean;
  }[] = [];
  const today = new Date().setHours(0, 0, 0, 0);
  for (let i = -1; i < 6; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push({
      fullDate: date.toISOString().split('T')[0],
      dayNumber: date.getDate(),
      dayName: date.toLocaleDateString('lt-LT', { weekday: 'short' }),
      isPast: date.getTime() < today,
    });
  }
  return days;
};

export default function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState('');
  const [repairOption, setRepairOption] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [carDetails, setCarDetails] = useState({
    make: '',
    model: '',
    year: '',
    tireSize: '',
    tireQuantity: '',
  });
  const [valveChange, setValveChange] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [services, setServices] = useState<
    { id: number; name: string; price_min: number; price_max: number }[]
  >([]);
  const [carMakes, setCarMakes] = useState<string[]>([]);
  const [carModels, setCarModels] = useState<{ [key: string]: string[] }>({});
  const [selectedMake, setSelectedMake] = useState('');
  const [weekStart, setWeekStart] = useState(new Date());
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllMakes()
      .then(makes => setCarMakes(makes.map((m: any) => m.Make_Name)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedMake) return;
    if (carModels[selectedMake]) return;
    getModelsForMake(selectedMake)
      .then(models =>
        setCarModels(prev => ({
          ...prev,
          [selectedMake]: models.map((m: any) => m.Model_Name),
        }))
      )
      .catch(console.error);
  }, [selectedMake, carModels]);

  useEffect(() => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    axios.get('/api/services')
      .then(r => setServices(r.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setSelectedTime(null);
    setRepairOption(null);
  }, [selectedDate]);

  interface BookingData {
    bookingTime: string;
    _count: { bookingTime: number };
  }

  useEffect(() => {
    if (!selectedDate) return;

    axios.get<BookingData[]>('/api/checkout/bookings', {
      params: { date: selectedDate },
    })
    .then(({ data }) => {
      const counts = data.reduce<Record<string, number>>((acc, { bookingTime, _count }) => {
        acc[bookingTime] = _count.bookingTime;
        return acc;
      }, {});
      const fullyBooked = Object.entries(counts)
        .filter(([_, cnt]) => cnt >= 2)
        .map(([time]) => time);
      setBookedTimes(fullyBooked);
    })
    .catch(console.error);
  }, [selectedDate]);

  const handleCarDetailChange = (
    field: keyof typeof carDetails,
    value: string
  ) => {
    setCarDetails(prev => ({ ...prev, [field]: value }));
  };

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
    if (!isBookingValid ||
      (selectedService === 'Padangos remontas' && !repairOption)
  ) return;
    const details = {
      date: selectedDate,
      time: selectedTime!,
      carDetails,
      selectedService: {
        name: selectedService,
        price_min: services.find(s => s.name === selectedService)?.price_min || 0,
        price_max: services.find(s => s.name === selectedService)?.price_max || 0,
      },
      valveChange,
      tireQuantity: parseInt(carDetails.tireQuantity, 10),
      repairOption,
    };
    localStorage.setItem('bookingDetails', JSON.stringify(details));
    navigate('/checkout');
  };

  const getFilteredTimes = () => {
    let times = [...availableTimes];
    const todayStr = new Date().toISOString().split('T')[0];

    if (selectedDate === todayStr) {
      const now = new Date();
      const currentMin = now.getHours() * 60 + now.getMinutes();

      times = times.filter(time => {
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m > currentMin;
      });
    }

    return times;
  };

  const times = getFilteredTimes();
  const weekDays = getWeekDays(weekStart);

  return (
    <div className="booking-page">
      <section className="calendar-section">
        <h2 className="calendar-title">Pasirinkite laiką ir paslaugą</h2>
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
              if (prev >= new Date(new Date().setHours(0, 0, 0, 0))) {
                setWeekStart(prev);
              }
            }}
            disabled={weekStart <= new Date(new Date().setHours(0, 0, 0, 0))}
          >
            &lt;
          </button>

          <div className="week-days">
            {weekDays.map(day => (
              <div
                key={day.fullDate}
                className={`day-circle ${
                  selectedDate === day.fullDate ? 'selected' : ''
                } ${day.isPast ? 'disabled' : ''}`}
                onClick={() => !day.isPast && setSelectedDate(day.fullDate)}
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
                className={`time-slot ${
                  selectedTime === time ? 'selected' : ''
                } ${bookedTimes.includes(time) ? 'disabled' : ''}`}
                onClick={() =>
                  !bookedTimes.includes(time) && setSelectedTime(time)
                }
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
        <div className="car-service-box">
          <div className="car-service-box-information-box">
            <h3 className="car-service-title">Automobilio duomenys</h3>
            <div className="car-service-box-information">
              <Dropdown
                options={carMakes.map(m => ({ value: m, label: m }))}
                value={carDetails.make}
                onChange={v => {
                  handleCarDetailChange('make', v);
                  setSelectedMake(v);
                }}
                placeholder="Gamintojas"
                className="dropdown-make"
                searchable
              />
              <Dropdown
                options={(carModels[carDetails.make] || []).map(m => ({
                  value: m,
                  label: m,
                }))}
                value={carDetails.model}
                onChange={v => handleCarDetailChange('model', v)}
                placeholder="Modelis"
                className="dropdown-model"
                disabled={!carDetails.make}
                searchable
              />
              <Dropdown
                options={Array.from({ length: 30 }, (_, i) => {
                  const y = new Date().getFullYear() - i;
                  return { value: String(y), label: String(y) };
                })}
                value={carDetails.year}
                onChange={v => handleCarDetailChange('year', v)}
                placeholder="Pagaminimo metai"
                className="dropdown-year"
              />
              <Dropdown
                options={tireSizes.map(sz => ({ value: sz, label: sz }))}
                value={carDetails.tireSize}
                onChange={v => handleCarDetailChange('tireSize', v)}
                placeholder="Ratų išmatavimai"
                className="dropdown-tire-size"
              />
            </div>
          </div>

          <div className="service-options">
            <div className="top-options">
              <div className="service-options-choice">
                <Dropdown
                  options={services.map(s => ({ value: s.name, label: s.name }))}
                  value={selectedService}
                  onChange={setSelectedService}
                  placeholder="Pasirinkite paslaugą"
                  className="dropdown-service"
                />
              </div>
              <div className="service-tire-quantity">
                <Dropdown
                  options={tireQuantity.map(q => ({ value: q, label: q }))}
                  value={carDetails.tireQuantity}
                  onChange={v => handleCarDetailChange('tireQuantity', v)}
                  placeholder="Ratų kiekis"
                  className="dropdown-tire-quantity"
                />
              </div>
            </div>
            
            <div className="bottom-options">
            {selectedService === 'Padangos remontas' && (
              <div className="repair-options">
                <Dropdown
                  options={[
                    { value: 'ventiliu-keitimas', label: 'Ventilių keitimas' },
                    { value: 'siulo-iverimas', label: 'Siūlo įvėrimas' },
                    { value: 'lopas',           label: 'Lopo dėjimas' },
                  ]}
                  value={repairOption || ''}
                  onChange={setRepairOption}
                  placeholder="Remonto tipas"
                  className="dropdown-repair"
                />
              </div>
            )}
              <div className="service-valves-optional">
                <label>
                  Ventilių keitimas
                  <input
                    type="checkbox"
                    checked={valveChange}
                    onChange={e => setValveChange(e.target.checked)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}