import { Navigate } from 'react-router-dom';
import { JSX } from 'react';

export default function ProtectedRoute({ children, roles }: { children: JSX.Element; roles: string[] }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token || !roles.includes(userRole || '')) {
    return <Navigate to="*" />;
  }

  return children;
}