export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    status: 'active' | 'not_confirmed' | 'blocked';
    role: 'admin' | 'client';
  }

  export interface UserFilters {
    search: string;
    role: string;
    status: string;
  }

  export interface UserFormData {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password?: string;
    role: 'admin' | 'client';
    status: 'active' | 'not_confirmed' | 'blocked';
  }
  