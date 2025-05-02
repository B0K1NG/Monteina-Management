import { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { normalizeTime } from '../utils/normalizeTime';

export function useBookedTimes(date: string) {
  const [booked, set] = useState<string[]>([]);
  useEffect(() => {
    if (!date) return;
    axios.get('/api/checkout/bookings', { params: { date } })
      .then(r => {
        const times = r.data
          .filter((e:any) => e._count?.bookingTime >= 2)
          .map((e:any) => normalizeTime(e.bookingTime));
        set(times);
      })
      .catch(console.error);
  }, [date]);
  return booked;
}
