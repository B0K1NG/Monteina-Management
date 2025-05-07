import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../api/axios';

const schema = z.object({
  email: z.string().email('Neteisingas el. pašto formatas'),
});

type FormValues = {
  email: string;
};

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (data: FormValues) => {
    try {
      await axios.post('/auth/forgot-password', data);
      setIsSubmitted(true);
      toast.success('Slaptažodžio atkūrimo instrukcijos išsiųstos į jūsų el. paštą.');
    } catch (error) {
      toast.error('Nepavyko išsiųsti slaptažodžio atkūrimo instrukcijų.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="login-title">Slaptažodžio atkūrimas</h1>
        
        {!isSubmitted ? (
          <>
            <p className="forgot-instructions">
              Įveskite savo el. pašto adresą, ir mes jums atsiųsime slaptažodžio atkūrimo nuorodą.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
              <input
                {...register('email')}
                type="email"
                placeholder="El. paštas"
                className="login-input"
              />
              {errors.email && <p className="login-error">{errors.email.message}</p>}
              
              <button type="submit" className="login-button">Siųsti atkūrimo nuorodą</button>
            </form>
          </>
        ) : (
          <div className="success-message">
            <p>Slaptažodžio atkūrimo instrukcijos išsiųstos į jūsų el. paštą.</p>
            <p>Patikrinkite savo pašto dėžutę ir sekite instrukcijas.</p>
          </div>
        )}
        
        <p className="login-register">
          <Link to="/login">Grįžti į prisijungimo puslapį</Link>
        </p>
      </div>
      <div className="login-right">
        <img src="/src/assets/icons/not_found_icon.png" alt="Padangų Montavimas" />
      </div>
    </div>
  );
}