export interface MyJwtPayload {
    id: string;
    iat: number;
    exp: number;
  }
  
  export interface BookingDetails {
    date: string;
    time: string;
    carDetails: {
      make: string;
      model: string;
      tireSize: string;
    };
    selectedService: {
      name: string;
      price_min: number;
      price_max: number;
    };
    valveChange: boolean;
    tireQuantity: number;
    repairOption?: 'ventiliu-keitimas' | 'siulo-iverimas' | 'lopas';
  }