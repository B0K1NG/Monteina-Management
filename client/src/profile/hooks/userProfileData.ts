import { useState, useEffect } from 'react';
import { fetchUserInfo } from '../../api/auth';
import {
  fetchPreviousVisits,
  fetchActiveBookings,
} from '../../api/booking';
import { UserInfo, Visit, Booking } from '../types';

export function useProfileData() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [previousVisits, setPreviousVisits] = useState<Visit[]>([]);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    Promise.all([
      fetchUserInfo(),
      fetchPreviousVisits(),
      fetchActiveBookings(),
    ])
      .then(([user, visits, bookings]) => {
        setUserInfo(user);
        setPreviousVisits(visits);
        setActiveBookings(bookings);
      })
      .catch(setError);
  }, []);

  return { userInfo, previousVisits, activeBookings, setActiveBookings, error };
}
