import { useState, useEffect, useCallback } from 'react';
import axios from '../../../api/axios';
import { Service } from '../types';
import { useLoading } from '../../../contexts/LoadingContext';

export default function useServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const { setLoading } = useLoading();

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<Service[]>('/api/services/admin');
      setServices(res.data);
    } catch (e) {
      console.error('Failed to fetch services:', e);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const addService = async (svc: Omit<Service, 'id' | 'status'>) => {
    try {
      const res = await axios.post<Service>('/api/services', { ...svc, status: 'active' });
      if (res.status === 201) {
        setServices(prev => [...prev, res.data]);
        return true;
      }
    } catch (e) {
      console.error('Error adding service:', e);
    }
    return false;
  };

  const editService = async (id: number, svc: Omit<Service, 'id'>) => {
    try {
      const res = await axios.put<Service>(`/api/services/${id}`, svc);
      if (res.status === 200) {
        setServices(prev => prev.map(s => s.id === id ? res.data : s));
        return true;
      }
    } catch (e) {
      console.error('Error editing service:', e);
    }
    return false;
  };

  const deleteService = async (id: number) => {
    try {
      const res = await axios.delete(`/api/services/${id}`);
      if (res.status === 200) {
        setServices(prev => prev.filter(s => s.id !== id));
        return true;
      }
    } catch (e) {
      console.error('Error deleting service:', e);
    }
    return false;
  };

  return { services, addService, editService, deleteService };
}
