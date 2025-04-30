import { useState, useEffect } from 'react';
import axios from '../../api/axios';

interface Booking {
  id: number;
  bookingDate: string;
  bookingTime: string;
  userName: string;
  serviceName: string;
  totalAmount: number;
  status: 'active' | 'done' | 'canceled';
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get<Booking[]>('/api/checkout/all-bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const filtered = bookings.filter(
      (b) => b.bookingDate === selectedDate && b.status === 'active'
    );
    setFilteredBookings(filtered);
  }, [selectedDate, bookings]);

  const getActiveAndDoneCount = () => {
    return bookings.filter(
      (b) => b.bookingDate === selectedDate && (b.status === 'active' || b.status === 'done')
    ).length;
  };

  const getDateLabel = () => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (selectedDate === today) return 'Šiandiena';
    if (selectedDate === tomorrow) return 'Rytoj';
    if (selectedDate === yesterday) return 'Vakar';
    return selectedDate;
  };

  const calculateTotalAmount = () => {
    return bookings
      .filter((b) => b.bookingDate === selectedDate)
      .reduce((sum, b) => {
        if (b.status === 'canceled') {
          return sum + 5;
        }
        return sum + (b.totalAmount || 0);
      }, 0);
  };

  const calculateAveragePrice = () => {
    const bookingsForDay = bookings.filter(
      (b) => b.bookingDate === selectedDate && b.status !== 'canceled'
    );
    if (bookingsForDay.length === 0) return '0.00';
    return (
      bookingsForDay.reduce((sum, b) => sum + (b.totalAmount || 0), 0) / bookingsForDay.length
    ).toFixed(2);
  };

  const getMostPopularService = () => {
    const serviceCount: Record<string, number> = {};
    bookings
      .filter((b) => b.bookingDate === selectedDate && (b.status === 'active' || b.status === 'done'))
      .forEach((b) => {
        serviceCount[b.serviceName] = (serviceCount[b.serviceName] || 0) + 1;
      });
    return Object.entries(serviceCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Dar nebuvo rezervacijų';
  };

  const getClosestReservation = () => {
    const upcoming = filteredBookings.filter((b) => b.status === 'active');
    if (upcoming.length === 0) return 'Kol kas nėra';
    return upcoming.sort((a, b) => a.bookingTime.localeCompare(b.bookingTime))[0].bookingTime;
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      <div className="date-selector">
        <label htmlFor="date">Peržiūra:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <span>{getDateLabel()}</span>
      </div>

      <div className="dashboard-boxes">
        <div className="box">
          <h2>{getActiveAndDoneCount()}</h2>
          <p>{getDateLabel()} rezervacijų skaičius</p>
          <p>Artimiausia rezervacija {getClosestReservation()}</p>
        </div>

        <div className="box">
          <h2>{calculateTotalAmount()} €</h2>
          <p>{getDateLabel()} pajamos</p>
          <p>Vidutinė paslaugos kaina </p>
          <p>{calculateAveragePrice()} €</p>
        </div>

        <div className="box">
          <h2>Populiariausia paslauga</h2>
          <p>{getMostPopularService()}</p>
        </div>
      </div>

      <div className="upcoming-reservations">
        <h2>Artėjančios rezervacijos</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Laikas</th>
              <th>Klientas</th>
              <th>Paslauga</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.slice(0, 6).map((b) => (
              <tr key={b.id}>
                <td>{b.bookingDate}</td>
                <td>{b.bookingTime}</td>
                <td>{b.userName || 'N/A'}</td>
                <td>{b.serviceName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}