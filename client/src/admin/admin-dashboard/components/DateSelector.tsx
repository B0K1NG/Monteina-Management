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
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <input
        ref={inputRef}
        type="date"
        value={selectedDate}
        onChange={e => onDateChange(e.target.value)}
        style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          opacity: 0,
          cursor: 'pointer',
          zIndex: 1,
        }}
      />

      <span
        onClick={openPicker}
        style={{
          position: 'relative',
          zIndex: 2,
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        Peržiūra: {getDateLabel(selectedDate)}
      </span>
    </div>
  );
}
