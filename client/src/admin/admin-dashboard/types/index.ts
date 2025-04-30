export interface Booking {
    id: number;
    bookingDate: string;
    bookingTime: string;
    userName: string;
    serviceName: string;
    totalAmount: number;
    status: 'active' | 'done' | 'canceled';
  }
  