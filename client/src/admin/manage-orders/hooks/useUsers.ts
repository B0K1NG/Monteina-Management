import { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { User } from '../types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    axios.get<User[]>('/api/users')
      .then(r => setUsers(r.data))
      .catch(console.error);
  }, []);
  return users;
}
