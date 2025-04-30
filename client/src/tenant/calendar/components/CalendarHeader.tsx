import React from 'react';

interface Props {
  monthLabel: string;
}

const CalendarHeader: React.FC<Props> = ({
  monthLabel
}) => (
  <div className="calendar-header">
    <div className="month-label">{monthLabel}</div>
  </div>
);

export default CalendarHeader;