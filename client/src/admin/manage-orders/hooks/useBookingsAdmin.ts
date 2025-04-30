import { useState, useEffect, useCallback } from 'react';
import axios from '../../../api/axios';
import { Booking } from '../types';
import { normalizeTime } from '../utils/normalizeTime';

export function useBookingsAdmin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const fetchAll = useCallback(() => {
    axios.get<Booking[]>('/api/checkout/all-bookings')
      .then(r => {
        setBookings(r.data.map(b => ({
          ...b,
          bookingTime: normalizeTime(b.bookingTime)
        })));
      })
      .catch(console.error);
  }, []);
  useEffect(fetchAll, [fetchAll]);
  return { bookings, refresh: fetchAll };
}
