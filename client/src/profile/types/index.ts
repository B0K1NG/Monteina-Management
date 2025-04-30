export interface UserInfo {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }
  
  export interface Visit {
    bookingDate: string;
    totalAmount: number;
    serviceName?: string;
  }
  
  export interface Booking {
    id: number;
    bookingDate: string;
    bookingTime: string;
    serviceName: string;
  }
  
  export type ModalType = 
    | { type: 'password' }
    | { type: 'cancel'; bookingId: number }
    | { type: 'invoice'; invoice: Visit };