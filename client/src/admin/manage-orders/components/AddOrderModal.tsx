import { useState, useEffect } from 'react';
import Dropdown from '../../../components/Dropdown';
import { User, Service, OrderFormData } from '../types';
import { useCarMakesModels } from '../hooks/useCarMakesModels';
import { useBookedTimes } from '../hooks/useBookedTimes';
import { toast } from 'react-toastify';

type Props = {
  isOpen: boolean;
  users: User[];
  services: Service[];
  makes: string[];
  models: Record<string, string[]>;
  fetchModels: (make: string) => void;
  onCancel: () => void;
  onSave: (p: OrderFormData) => Promise<void>;
};

export default function AddOrderModal({
  isOpen,
  users,
  services,
  onCancel,
  onSave,
}: Props) {
  const [userId, setUserId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [repairOption, setRepairOption] = useState<string>();
  const [valveChange, setValveChange] = useState(false);
  const [tireQuantity, setTireQuantity] = useState('');
  const [tireSize, setTireSize] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [status, setStatus] = useState<'active' | 'done' | 'canceled'>('active');
  const [manualTotalAmount, setManualTotalAmount] = useState('');
  const [carDetails, setCarDetails] = useState({
    make: '',
    model: '',
    year: '',
    tireSize: '',
  });
  const [customModel, setCustomModel] = useState('');
  const { makes, models, fetchModels } = useCarMakesModels();

  const booked = useBookedTimes(bookingDate);

  useEffect(() => {
    if (!isOpen) {
      setUserId('');
      setServiceId('');
      setRepairOption(undefined);
      setValveChange(false);
      setTireQuantity('');
      setTireSize('');
      setBookingDate('');
      setBookingTime('');
      setStatus('active');
      setManualTotalAmount('');
      setCarDetails({ make: '', model: '', year: '', tireSize: '' });
      setCustomModel('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (tireSize) {
      setCarDetails(cd => ({ ...cd, tireSize }));
    }
  }, [tireSize]);

  useEffect(() => {
    if (makes.length > 0) {
      fetchModels(makes[0]);
    }
  }, [makes]);

  const handleSave = () => {
    if (!userId || !serviceId || !status) {
      toast.info('Prašome užpildyti visus laukus!');
      return;
    }

    if (!bookingDate) {
      toast.info('Pasirinkite datą!');
      return;
    }

    if (status === 'active' && !bookingTime) {
      toast.info('Aktyviam užsakymui pasirinkite laiką!');
      return;
    }

    if (!tireSize) {
      toast.info('Pasirinkite ratų išmatavimus!');
      return;
    }

    const dateToValidate = new Date(bookingDate);
    if (isNaN(dateToValidate.getTime())) {
      toast.error('Netinkamas datos formatas!');
      return;
    }

    const formattedDate = bookingDate.split('T')[0];

    const updatedCarDetails = {
      ...carDetails,
      model: carDetails.make === 'Kita' ? customModel : carDetails.model,
    };

    onSave({
      userId,
      serviceId,
      bookingDate: formattedDate,
      bookingTime: bookingTime || '',
      status,
      repairOption,
      valveChange,
      tireQuantity: Number(tireQuantity) || 0,
      tireSize,
      manualTotalAmount: manualTotalAmount
        ? parseFloat(manualTotalAmount)
        : undefined,
      carDetails: updatedCarDetails,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="add-modal">
      <div className="add-modal-content">
        <h2>Užsakymo Pridėjimas</h2>
        <div className="add-modal-grid">
          <div>
            <label>Klientas</label>
            <Dropdown
              options={users.map((u) => ({
                value: u.id,
                label: `${u.firstName} ${u.lastName}`,
              }))}
              value={userId}
              onChange={setUserId}
              placeholder="Pasirinkite klientą"
            />
          </div>

          <div>
            <label>Paslauga</label>
            <Dropdown
              options={services.map(s => ({
                value: s.id,
                label: s.name
              }))}
              value={serviceId}
              onChange={setServiceId}
              placeholder="Pasirinkite paslaugą"
            />
          </div>

          {services.find(s => s.id === serviceId)?.name === 'Padangos remontas' && (
            <div>
              <label>Remonto tipas</label>
              <Dropdown
                options={[
                  { value: 'ventiliu-keitimas', label: 'Ventilių keitimas' },
                  { value: 'siulo-iverimas', label: 'Siūlo įvėrimas' },
                  { value: 'lopas', label: 'Lopo dėjimas' },
                ]}
                value={repairOption || ''}
                onChange={setRepairOption}
                placeholder="Pasirinkite remonto tipą"
              />
            </div>
          )}

          <div>
            <label>Gamintojas</label>
            <Dropdown
              options={[
                ...makes.map((m) => ({ value: m, label: m })),
                { value: 'Kita', label: 'Kita' },
              ]}
              value={carDetails.make}
              onChange={(make) => {
                setCarDetails((cd) => ({ ...cd, make }));
                if (make !== 'Kita') {
                  fetchModels(make);
                  setCustomModel('');
                }
              }}
              placeholder="Pasirinkite gamintoją"
              searchable
            />
          </div>

          {carDetails.make === 'Kita' ? (
            <div>
              <label>Modelis</label>
              <input
                type="text"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder="Įveskite modelį"
                className="input-model"
              />
            </div>
          ) : (
            <div>
              <label>Modelis</label>
              <Dropdown
                options={(models[carDetails.make] || []).map((m) => ({
                  value: m,
                  label: m,
                }))}
                value={carDetails.model}
                onChange={(model) =>
                  setCarDetails((cd) => ({ ...cd, model }))
                }
                placeholder="Pasirinkite modelį"
                disabled={!carDetails.make}
                searchable
              />
            </div>
          )}

          <div>
            <label>Pagaminimo metai</label>
            <Dropdown
              options={Array.from({ length: 30 }, (_, i) => {
                const y = String(new Date().getFullYear() - i);
                return { value: y, label: y };
              })}
              value={carDetails.year}
              onChange={year => setCarDetails(cd => ({ ...cd, year }))}
              placeholder="Pasirinkite metus"
            />
          </div>

          <div>
            <label>Ratų išmatavimai</label>
            <Dropdown
              options={Array.from({ length: 16 }, (_, i) => {
                const size = `R${i + 10}`;
                return { value: size, label: size };
              })}
              value={tireSize}
              onChange={setTireSize}
              placeholder="Pasirinkite išmatavimus"
            />
          </div>

          <div>
            <label>Ratų kiekis</label>
            <Dropdown
              options={Array.from({ length: 100 }, (_, i) => ({
                value: String(i + 1),
                label: `${i + 1} vnt.`
              }))}
              value={tireQuantity}
              onChange={setTireQuantity}
              placeholder="Pasirinkite kiekį"
            />
          </div>

          <div>
            <label>Data</label>
            <Dropdown
              options={(() => {
                const dates = [];
                const today = new Date();

                for (let i = 30; i >= 1; i--) {
                  const pastDate = new Date();
                  pastDate.setDate(today.getDate() - i);
                  const dateStr = pastDate.toISOString().split('T')[0];
                  dates.push({ value: dateStr, label: dateStr });
                }

                for (let i = 0; i <= 30; i++) {
                  const futureDate = new Date();
                  futureDate.setDate(today.getDate() + i);
                  const dateStr = futureDate.toISOString().split('T')[0];
                  dates.push({ value: dateStr, label: dateStr });
                }
                
                return dates;
              })()}
              value={bookingDate}
              onChange={setBookingDate}
              placeholder="Pasirinkite datą"
              searchable
            />
          </div>

          <div>
            <label>Laikas</label>
            <Dropdown
              options={Array.from({ length: 22 }, (_, i) => {
                const h = Math.floor(i / 2) + 9;
                const m = i % 2 ? '30' : '00';
                const t = `${h}:${m}`;

                const selectedDate = new Date(bookingDate);
                const now = new Date();

                const selectedDateOnly = new Date(selectedDate);
                selectedDateOnly.setHours(0,0,0,0);
                const nowDateOnly = new Date(now);
                nowDateOnly.setHours(0,0,0,0);

                const isTodayAndPastTime = 
                  selectedDate.toDateString() === now.toDateString() && 
                  (h < now.getHours() || (h === now.getHours() && Number(m) < now.getMinutes()));

                const isPastTimeSlot = selectedDateOnly < nowDateOnly || isTodayAndPastTime;

                const isDisabled = isPastTimeSlot 
                  ? status !== 'done' 
                  : booked.includes(t);
                
                return {
                  value: t,
                  label: t,
                  disabled: isDisabled,
                  className: isDisabled ? 'time-slot disabled' : 'time-slot'
                };
              })}
              value={bookingTime}
              onChange={setBookingTime}
              placeholder="Pasirinkite laiką"
            />
          </div>

          <div>
            <label>Statusas</label>
            <Dropdown
              options={[
                { value: 'active', label: 'Aktyvus' },
                { value: 'done', label: 'Baigtas' },
                { value: 'canceled', label: 'Atšauktas' },
              ]}
              value={status}
              onChange={(value) => {
                const newStatus = value as 'active' | 'done' | 'canceled';
                setStatus(newStatus);

                const selectedDate = new Date(bookingDate);
                const selectedTime = bookingTime.split(':').map(Number);
                const now = new Date();
                
                if (newStatus === 'active') {
                  const isPastTime = (
                    selectedDate < now || 
                    (selectedDate.toDateString() === now.toDateString() && 
                     selectedTime[0] < now.getHours() || 
                     (selectedTime[0] === now.getHours() && selectedTime[1] < now.getMinutes()))
                  );
                  
                  if (isPastTime) {
                    setBookingTime('');
                  }
                }
              }}
              placeholder="Pasirinkite statusą"
            />
          </div>

          <div>
            <label>Ventilių keitimas</label>
            <Dropdown
              options={[
                { value: 'yes', label: 'Taip' },
                { value: 'no', label: 'Ne' },
              ]}
              value={valveChange ? 'yes' : 'no'}
              onChange={(value) => setValveChange(value === 'yes')}
              placeholder="Pasirinkite"
            />
          </div>

          <div>
            <label>Bendra suma</label>
            <input
              type="text"
              value={manualTotalAmount}
              onChange={(e) => setManualTotalAmount(e.target.value)}
              placeholder="Įveskite bendrą sumą"
            />
          </div>
        </div>

        <div className="modal-buttons">
          <button className="btn btn--secondary cancel-button" onClick={onCancel}>
            Atšaukti
          </button>
          <button
            className="btn btn--primary suceed-button"
            onClick={handleSave}
          >
            Pridėti
          </button>
        </div>
      </div>
    </div>
  );
}
