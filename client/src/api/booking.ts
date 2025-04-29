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

export interface CreateOrderData {
  paymentStatus?: string;
  userId: string;
  bookingDate: string;
  bookingTime: string;
  serviceId: string;
  status: string;
  repairOption?: string;
  valveChange: boolean;
  tireQuantity: number;
  tireSize?: string;
  carDetails?: {
      make: string;
      model: string;
      tireSize: string;
  };
  selectedService: {
      name: string;
  };
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
}

export const createOrder = async (orderData: CreateOrderData) => {
    console.log('Order Data:', orderData);
    try {
        const response = await axios.post('/api/checkout', orderData);
        return response.data;
    } catch (error) {
        console.error('Failed to create order:', error);
        throw error;
    }
};