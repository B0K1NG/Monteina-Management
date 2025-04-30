export interface User {
    id: string;
    firstName: string;
    lastName: string;
  }
  
  export interface Service {
    price_max: null;
    id: string;
    name: string;
    price_min?: number;
  }
  
  export interface Booking {
    id: string;
    bookingDate: string;
    bookingTime: string;
    userName: string;
    serviceName: string;
    status: 'active' | 'done' | 'canceled';
    serviceId: string;
  }
  
  export interface OrderFormData {
    userId: string;
    serviceId: string;
    bookingDate: string;
    bookingTime: string;
    status: 'active' | 'done' | 'canceled';
    repairOption?: string;
    valveChange: boolean;
    tireQuantity: number;
    tireSize: string;
    carDetails: {
      make: string;
      model: string;
      year: string;
      tireSize: string;
    };
  }
  
  export interface CreateOrderData extends OrderFormData {
    paymentStatus: 'success' | 'not-success';
    selectedService: {
      name: string;
      price_min: number;
      price_max?: number;
    };
    advanceAmount: number;
    totalAmount: number;
    remainingAmount: number;
  }
  