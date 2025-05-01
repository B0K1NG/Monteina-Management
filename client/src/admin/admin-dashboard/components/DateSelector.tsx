import { useRef } from 'react';
import { getDateLabel } from '../utils/dateUtils';

interface Props {
  selectedDate: string;
  onDateChange(date: string): void;
}

export default function DateSelector({ selectedDate, onDateChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    if (inputRef.current?.showPicker) {
      inputRef.current.showPicker();
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="date-selector">
      <input
        ref={inputRef}
        type="date"
        value={selectedDate}
        onChange={e => onDateChange(e.target.value)}
      />

      <span onClick={openPicker}>
        Peržiūra: {getDateLabel(selectedDate)}
      </span>
    </div>
  );
}
