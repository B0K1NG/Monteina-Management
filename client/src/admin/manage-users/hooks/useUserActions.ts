import axios from '../../../api/axios';
import { UserFormData, User } from '../types';

export async function addUser(data: UserFormData): Promise<User> {
  const res = await axios.post<User>('/api/users', data);
  return res.data;
}

export async function updateUser(data: UserFormData): Promise<User> {
  const res = await axios.put<User>(`/api/users/${data.id}`, data);
  return res.data;
}