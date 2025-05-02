import axios from '../../../api/axios';
import { useNavigate } from 'react-router-dom';
import { getUserIdFromToken } from '../utils/jwt';
import { BookingDetails } from '../types';

export default function usePayment() {
  const navigate = useNavigate();

  const pay = async (details: BookingDetails & {
    serviceId: string;
    totalAmount: number;
    advanceAmount: number;
    remaining: number;
  }) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      return navigate('/confirmation', { state: { success: false } });
    }

    const bookingDate = new Date(details.date);

    try {
      const res = await axios.post('/api/checkout', {
        ...details,
        date: bookingDate.toISOString().split('T')[0],
        userId,
        paymentStatus: 'success',
      });
      if (res.status === 200) {
        localStorage.removeItem('bookingDetails');
        return navigate('/confirmation', {
          state: {
            success: true,
            serviceId: details.serviceId,
            totalAmount: details.totalAmount,
            advanceAmount: details.advanceAmount,
            bookingDate: bookingDate.toISOString().split('T')[0],
            bookingTime: details.time,
          }
        });
      }
    } catch {}
    return navigate('/confirmation', { state: { success: false } });
  };

  return pay;
}