import React from 'react';

interface Props {
  times: string[];
  selectedTime: string | null;
  bookedTimes: string[];
  onSelect(time: string): void;
}

const TimeSlots: React.FC<Props> = ({
  times,
  selectedTime,
  bookedTimes,
  onSelect
}) => (
  <div className={`time-slots ${times.length === 0 ? 'empty' : ''}`}>
    {times.length > 0 ? (
      times.map(t => (
        <div
          key={t}
          className={`time-slot ${
            selectedTime === t ? 'selected' : ''
          } ${bookedTimes.includes(t) ? 'disabled' : ''}`}
          onClick={() => !bookedTimes.includes(t) && onSelect(t)}
        >
          {t}
        </div>
      ))
    ) : (
      <div className="empty">Nėra laisvų laikų</div>
    )}
  </div>
);

export default TimeSlots;