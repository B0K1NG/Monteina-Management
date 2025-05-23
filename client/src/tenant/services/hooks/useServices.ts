import axios from '../../../api/axios';

import { useState, useEffect } from 'react';
import { Service } from '../types';
import { useLoading } from '../../../contexts/LoadingContext';

export default function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const  { setLoading } = useLoading();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const resp = await axios.get<Service[]>('/api/services');
        setServices(resp.data);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to fetch services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [setLoading]);

  return { services, error };
}