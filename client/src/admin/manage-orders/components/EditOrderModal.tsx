import { useState, useEffect } from 'react';
import Dropdown from '../../../components/Dropdown';
import { Booking } from '../types';
import { useBookedTimes } from '../hooks/useBookedTimes';

interface Props {
  booking: Booking;
  onCancel(): void;
  onSave(updated: Booking): void;
}

export default function EditOrderModal({ booking, onCancel, onSave }: Props) {
  const [edited, setEdited] = useState<Booking>({ ...booking });
  const booked = useBookedTimes(booking.bookingDate);

  useEffect(() => {
    setEdited({ ...booking });
  }, [booking]);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Redaguoti Užsakymą</h2>
        <div className="modal-grid">
          <label>Data</label>
          <input
            type="date"
            value={edited.bookingDate}
            onChange={e =>
              setEdited(b => ({ ...b, bookingDate: e.target.value }))
            }
          />

          <label>Laikas</label>
          <Dropdown
            options={Array.from({ length: 22 }, (_, i) => {
              const h = Math.floor(i / 2) + 9;
              const m = i % 2 ? '30' : '00';
              const t = `${h}:${m}`;
              return {
                value: t,
                label: t,
                disabled:
                  booked.includes(t) && t !== booking.bookingTime,
              };
            })}
            value={edited.bookingTime}
            onChange={v => setEdited(b => ({ ...b, bookingTime: v }))}
            placeholder="Pasirinkite laiką"
          />

          <label>Statusas</label>
          <Dropdown
            options={[
              { value: 'active', label: 'Aktyvus' },
              { value: 'done', label: 'Baigtas' },
              { value: 'canceled', label: 'Atšauktas' },
            ]}
            value={edited.status}
            onChange={v => setEdited(b => ({ ...b, status: v as "active" | "done" | "canceled" }))}
            placeholder="Pasirinkite statusą"
          />
        </div>

        <div className="modal-buttons">
          <button className="btn btn--secondary" onClick={onCancel}>
            Atšaukti
          </button>
          <button
            className="btn btn--primary"
            onClick={() => onSave(edited)}
          >
            Išsaugoti
          </button>
        </div>
      </div>
    </div>
  );
}
