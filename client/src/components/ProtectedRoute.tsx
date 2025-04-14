import { Navigate } from 'react-router-dom';
import { JSX } from 'react';


export default function ProtectedRoute({ children, role }: { children: JSX.Element; role: string }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token || userRole !== role) {
    return <Navigate to="/login" />;
  }

  return children;
}