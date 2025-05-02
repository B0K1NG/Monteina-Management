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
    <div className="edit-modal">
      <div className="edit-modal-content">
        <h2>Užsakymo Koregavimas</h2>
        <div className="edit-modal-grid">
          <div className="form-field">
            <label>Vardas</label>
            <div className="user-name">
              {`${edited.userName.split(' ')[0]} ${edited.userName.split(' ')[1][0]}.`}
            </div>
          </div>

          <div className="form-field">
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
              value={edited.bookingDate}
              onChange={v => setEdited(b => ({ ...b, bookingDate: v }))}
              placeholder="Pasirinkite datą"
              searchable
            />
          </div>

          <div className="form-field">
            <label>Laikas</label>
            <Dropdown
              options={Array.from({ length: 22 }, (_, i) => {
                const h = Math.floor(i / 2) + 9;
                const m = i % 2 ? '30' : '00';
                const t = `${h}:${m}`;

                const selectedDate = new Date(edited.bookingDate);
                const now = new Date();

                const selectedDateOnly = new Date(selectedDate.setHours(0,0,0,0));
                const nowDateOnly = new Date(now.setHours(0,0,0,0));

                const isTodayAndPastTime = 
                  selectedDate.toDateString() === now.toDateString() && 
                  (h < now.getHours() || (h === now.getHours() && parseInt(m) < now.getMinutes()));

                const isPastTimeSlot = (selectedDateOnly < nowDateOnly) || isTodayAndPastTime;

                const isDisabled = isPastTimeSlot 
                  ? edited.status !== 'done' 
                  : (booked.includes(t) && t !== booking.bookingTime);
                
                return {
                  value: t,
                  label: t,
                  disabled: isDisabled,
                  className: isDisabled ? 'time-slot disabled' : 'time-slot'
                };
              })}
              value={edited.bookingTime}
              onChange={v => setEdited(b => ({ ...b, bookingTime: v }))}
              placeholder="Pasirinkite laiką"
            />
          </div>

          <div className="form-field">
            <label>Statusas</label>
            <Dropdown
              options={[
                { value: 'active', label: 'Aktyvus' },
                { value: 'done', label: 'Baigtas' },
                { value: 'canceled', label: 'Atšauktas' },
              ]}
              value={edited.status}
              onChange={v => {
                const newStatus = v as "active" | "done" | "canceled";
                setEdited(b => ({ ...b, status: newStatus }));

                if (newStatus === 'active') {
                  const selectedDate = new Date(edited.bookingDate);
                  const selectedTime = edited.bookingTime.split(':').map(Number);
                  const now = new Date();
                  
                  const isPastTime = (
                    selectedDate < now || 
                    (selectedDate.toDateString() === now.toDateString() && 
                     selectedTime[0] < now.getHours() || 
                     (selectedTime[0] === now.getHours() && selectedTime[1] < now.getMinutes()))
                  );
                  
                  if (isPastTime) {
                    setEdited(b => ({ ...b, bookingTime: '' }));
                  }
                }
              }}
              placeholder="Pasirinkite statusą"
            />
          </div>
        </div>

        <div className="modal-buttons">
          <button className="btn btn--secondary cancel-button" onClick={onCancel}>
            Atšaukti
          </button>
          <button
            className="btn btn--primary suceed-button"
            onClick={() => onSave(edited)}
            disabled={edited.status === 'active' && edited.bookingTime === ''}
          >
            Išsaugoti
          </button>
        </div>
      </div>
    </div>
  );
}
