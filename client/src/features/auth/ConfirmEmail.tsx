import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [statusMessage, setStatusMessage] = useState('Patvirtinimo procesas vykdomas...');
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        await axios.get(`/auth/confirm?token=${token}`);
        setStatusMessage('El. pašto adresas patvirtintas sėkmingai! Nukreipiame į prisijungimo puslapį...');
        setTimeout(() => navigate('/login'), 5000);
      } catch (error) {
        console.error(error);
        setStatusMessage('Nepavyko patvirtinti el. pašto adreso. Bandykite dar kartą.');
      }
    };

    if (token) {
      confirmEmail();
    } else {
      setStatusMessage('Patvirtinimo nuoroda neteisinga.');
    }
  }, [token, navigate]);

  const handleResendConfirmation = async () => {
    try {
      const email = searchParams.get('email');
      if (!email) {
        setResendMessage('El. pašto adresas nerastas.');
        return;
      }
      await axios.post('/auth/resend-confirmation', { email });
      setResendMessage('Patvirtinimo laiškas išsiųstas dar kartą.');
    } catch (error) {
      console.error(error);
      setResendMessage('Nepavyko išsiųsti patvirtinimo laiško. Bandykite dar kartą.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 text-gray-800 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">{statusMessage}</h1>
        {statusMessage.includes('Nepavyko') && (
          <div>
            <button
              onClick={handleResendConfirmation}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            >
              Siųsti patvirtinimo laišką dar kartą
            </button>
            {resendMessage && <p className="mt-2 text-sm text-gray-600">{resendMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
