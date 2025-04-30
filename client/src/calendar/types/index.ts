export interface Service {
    id: number;
    name: string;
    description?: string;
    price_min: number;
    price_max: number;
  }
  
  export interface CarDetails {
    make: string;
    model: string;
    year: string;
    tireSize: string;
    tireQuantity: string;
  }
  
  export interface BookingEntry {
    bookingTime: string;
    status: string;
    _count?: { bookingTime: number };
  }
  
  export interface Day {
    fullDate: string;
    dayNumber: number;
    dayName: string;
    isPast: boolean;
  }