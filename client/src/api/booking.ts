import axios from './axios';

export const fetchPreviousVisits = async () => {
  const response = await axios.get('/api/profile/previous-visits');
  return response.data;
};

export const fetchActiveBookings = async () => {
  try {
    const response = await axios.get('/api/checkout/active');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch active bookings:', error);
    throw error;
  }
};

export const cancelBooking = async (id: number) => {
  try {
    const response = await axios.patch(`/api/checkout/cancel/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to cancel booking:', error);
    throw error;
  }
};