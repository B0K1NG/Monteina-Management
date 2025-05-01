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
  const [status, setStatus] = useState<'active'|'done'|'canceled'>('active');
  const [carDetails, setCarDetails] = useState({
    make: '',
    model: '',
    year: '',
    tireSize: '',
  });

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
      setCarDetails({ make: '', model: '', year: '', tireSize: '' });
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!userId || !serviceId || !bookingDate || !bookingTime || !status) {
      toast.info('Prašome užpildyti visus laukus!');
      return;
    }

    onSave({
      userId,
      serviceId,
      bookingDate,
      bookingTime,
      status,
      repairOption,
      valveChange,
      tireQuantity: Number(tireQuantity),
      tireSize,
      carDetails,
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
              options={users.map(u => ({
                value: u.id,
                label: `${u.firstName} ${u.lastName}`
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
              options={makes.map(m => ({ value: m, label: m }))}
              value={carDetails.make}
              onChange={make => {
                setCarDetails(cd => ({ ...cd, make }));
                fetchModels(make);
              }}
              placeholder="Pasirinkite gamintoją"
              searchable
            />
          </div>

          <div>
            <label>Modelis</label>
            <Dropdown
              options={(models[carDetails.make] || []).map(m => ({
                value: m,
                label: m
              }))}
              value={carDetails.model}
              onChange={model => setCarDetails(cd => ({ ...cd, model }))}
              placeholder="Pasirinkite modelį"
              disabled={!carDetails.make}
              searchable
            />
          </div>

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
              options={Array.from({ length: 31 }, (_, i) => {
                const day = String(i + 1).padStart(2, '0');
                const month = String(new Date().getMonth() + 1).padStart(2, '0');
                const year = String(new Date().getFullYear());
                const date = `${year}-${month}-${day}`;
                return { value: date, label: date };
              })}
              value={bookingDate}
              onChange={setBookingDate}
              placeholder="Pasirinkite datą"
            />
          </div>

          <div>
            <label>Laikas</label>
            <Dropdown
              options={Array.from({ length: 22 }, (_, i) => {
                const h = Math.floor(i / 2) + 9;
                const m = i % 2 ? '30' : '00';
                const t = `${h}:${m}`;
                return {
                  value: t,
                  label: t,
                  disabled: booked.includes(t),
                  className: booked.includes(t)
                    ? 'time-slot disabled'
                    : 'time-slot'
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
              onChange={(value) => setStatus(value as 'active' | 'done' | 'canceled')}
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
