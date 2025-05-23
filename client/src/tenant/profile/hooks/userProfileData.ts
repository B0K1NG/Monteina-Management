import { useState, useEffect } from 'react';
import { fetchUserInfo } from '../../../api/auth';
import {
  fetchPreviousVisits,
  fetchActiveBookings,
} from '../../../api/booking';
import { UserInfo, Visit, Booking } from '../types';
import { useLoading } from '../../../contexts/LoadingContext';

export function useProfileData() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [previousVisits, setPreviousVisits] = useState<Visit[]>([]);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [user, visits, bookings] = await Promise.all([
          fetchUserInfo(),
          fetchPreviousVisits(),
          fetchActiveBookings(),
        ]);
        setUserInfo(user);
        setPreviousVisits(visits);
        setActiveBookings(bookings);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to fetch profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setLoading]);

  return { userInfo, previousVisits, activeBookings, setActiveBookings, error };
}
