export interface ConfirmationState {
    success: boolean;
    serviceId?: string;
    totalAmount?: number;
    advanceAmount?: number;
    bookingDate?: string;
    bookingTime?: string;
  }