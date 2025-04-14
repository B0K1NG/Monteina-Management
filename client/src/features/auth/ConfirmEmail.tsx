import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await axios.get(`/auth/confirm?token=${token}`);
        alert(response.data.message);
        navigate('/login');
      } catch (error) {
        console.error(error);
        alert('Nepavyko patvirtinti el. pašto adreso.');
      }
    };

    if (token) {
      confirmEmail();
    }
  }, [token, navigate]);

  return <h1>Patvirtinimo procesas vykdomas...</h1>;
}