import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Service } from '../types';

export default function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  useEffect(() => {
    axios
      .get<Service[]>('/api/services')
      .then(r => setServices(r.data))
      .catch(console.error);
  }, []);
  return { services };
}