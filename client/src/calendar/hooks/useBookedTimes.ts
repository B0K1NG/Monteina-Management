import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { normalizeTime } from '../utils/dateUtils';
import { BookingEntry } from '../types';

export function useBookedTimes(date: string) {
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  useEffect(() => {
    if (!date) return;
    axios
      .get<BookingEntry[]>('/api/checkout/bookings', { params: { date } })
      .then(r => {
        const fully = r.data
          .filter(e => e.status !== 'canceled' && (e._count?.bookingTime ?? 0) >= 2)
          .map(e => normalizeTime(e.bookingTime));
        setBookedTimes(fully);
      })
      .catch(console.error);
  }, [date]);
  return bookedTimes;
}