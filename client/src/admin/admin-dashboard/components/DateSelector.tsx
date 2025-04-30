import { getDateLabel } from '../utils/dateUtils';

interface Props {
  selectedDate: string;
  onDateChange(date: string): void;
}

export default function DateSelector({ selectedDate, onDateChange }: Props) {
  return (
    <div className="date-selector">
      <label htmlFor="date">Peržiūra:</label>
      <input
        type="date"
        id="date"
        value={selectedDate}
        onChange={e => onDateChange(e.target.value)}
      />
      <span>{getDateLabel(selectedDate)}</span>
    </div>
  );
}