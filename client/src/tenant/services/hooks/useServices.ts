import { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { Service } from '../types';

export default function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
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
  }, []);

  return { services, loading, error };
}