import { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { Service } from '../types';

export function useServices() {
  const [services, set] = useState<Service[]>([]);
  useEffect(() => {
    axios.get<Service[]>('/api/services')
      .then(r => set(r.data))
      .catch(console.error);
  }, []);
  return services;
}
