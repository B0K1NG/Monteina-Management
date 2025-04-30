import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

export default function useBookingNavigate() {
  const navigate = useNavigate();
  return () => {
    if (isAuthenticated()) {
      navigate('/calendar');
    } else {
      navigate('/login');
    }
  };
}