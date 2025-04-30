import { jwtDecode } from 'jwt-decode';
import { MyJwtPayload } from '../types';

export function getUserIdFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const { id } = jwtDecode<MyJwtPayload>(token);
    return id;
  } catch {
    return null;
  }
}