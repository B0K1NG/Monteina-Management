import React from 'react';
import { Day } from '../types';

interface Props {
  days: Day[];
  selectedDate: string;
  onSelect(date: string): void;
}

const WeekDays: React.FC<Props> = ({ days, selectedDate, onSelect }) => (
  <div className="week-days">
    {days.map(d => (
      <div
        key={d.fullDate}
        className={`day-circle ${
          selectedDate === d.fullDate ? 'selected' : ''
        } ${d.isPast ? 'disabled' : ''}`}
        onClick={() => !d.isPast && onSelect(d.fullDate)}
      >
        <div className="day-name">{d.dayName}</div>
        <div className="day-number">{d.dayNumber}</div>
      </div>
    ))}
  </div>
);

export default WeekDays;