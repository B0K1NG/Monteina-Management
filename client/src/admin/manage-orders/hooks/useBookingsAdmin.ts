import { useState, useEffect, useCallback } from 'react';
import axios from '../../../api/axios';
import { Booking } from '../types';
import { normalizeTime } from '../utils/normalizeTime';
import { useLoading } from '../../../contexts/LoadingContext';

export function useBookingsAdmin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { setLoading } = useLoading();

  const fetchAll = useCallback(() => {
    setLoading(true);
    axios
      .get<Booking[]>('/api/checkout/all-bookings')
      .then((r) => {
        setBookings(
          r.data.map((b) => ({
            ...b,
            bookingTime: normalizeTime(b.bookingTime),
          }))
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false)); 
  }, [setLoading]);

  useEffect(fetchAll, [fetchAll]);

  return { bookings, refresh: fetchAll };
}
