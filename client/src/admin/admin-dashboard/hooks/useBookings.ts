import { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { Booking } from '../types';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<Booking[]>('/api/checkout/all-bookings');
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      }
    })();
  }, []);

  return bookings;
}