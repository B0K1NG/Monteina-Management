import { useState, useEffect, useCallback } from 'react';
import axios from '../../../api/axios';
import { User } from '../types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(() => {
    axios.get<User[]>('/api/users')
      .then(r => setUsers(r.data))
      .catch(console.error);
  }, []);

  useEffect(fetchUsers, [fetchUsers]);

  return { users, refresh: fetchUsers };
}