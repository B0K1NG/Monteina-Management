import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingDetails } from '../types';

export default function useBookingDetails() {
  const [details, setDetails] = useState<BookingDetails | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('bookingDetails');
    if (!stored) {
      navigate('/calendar', { replace: true });
    } else {
      setDetails(JSON.parse(stored));
    }
  }, [navigate]);

  return details;
}