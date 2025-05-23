import { useState, useEffect, useCallback } from 'react';
import axios from '../../../api/axios';
import { User } from '../types';
import { useLoading } from '../../../contexts/LoadingContext';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const { setLoading } = useLoading();

  const fetchUsers = useCallback(() => {
    setLoading(true);
    axios
      .get<User[]>('/api/users')
      .then((response) => setUsers(response.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [setLoading]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, refresh: fetchUsers };
}