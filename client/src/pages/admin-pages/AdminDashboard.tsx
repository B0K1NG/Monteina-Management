import { useState } from 'react';
import { useBookings } from '../../admin/admin-dashboard/hooks/useBookings';
import DateSelector from '../../admin/admin-dashboard/components/DateSelector';
import SummaryBoxes from '../../admin/admin-dashboard/components/SummaryBoxes';
import UpcomingReservations from '../../admin/admin-dashboard/components/UpcomingReservations';

import {
  normalizeDate
} from '../../admin/admin-dashboard/utils/dateUtils';

import {
  calculateTotalAmount,
  calculateAveragePrice,
  getMostPopularService,
  getClosestReservation
} from '../../admin/admin-dashboard/utils/metrics';

export default function AdminDashboardPage() {
  const bookings = useBookings();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const filtered = bookings.filter(
    b => normalizeDate(b.bookingDate) === selectedDate
  );

  const activeAndDoneCount = filtered.filter(
    b => b.status === 'active' || b.status === 'done'
  ).length;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Monteina</h1>
      <h2 className="dashboard-subtitle">Administratorius skydelis</h2>

      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <SummaryBoxes
        activeAndDoneCount={activeAndDoneCount}
        filteredCount={filtered.length}
        totalAmount={calculateTotalAmount(filtered)}
        averagePrice={calculateAveragePrice(filtered)}
        popularService={getMostPopularService(filtered)}
        closestReservation={getClosestReservation(filtered)}
      />

      <UpcomingReservations bookings={filtered} />
    </div>
  );
}