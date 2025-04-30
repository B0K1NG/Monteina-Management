import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const useAuthNavigate = () => {
  const navigate = useNavigate();
  return (path: string) => {
    if (isAuthenticated()) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };
};

export default useAuthNavigate;