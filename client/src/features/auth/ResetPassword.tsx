import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../api/axios';

const schema = z.object({
  password: z.string().min(8, 'Slaptažodis turi būti bent 8 simbolių ilgio'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Slaptažodžiai nesutampa",
  path: ["confirmPassword"],
});

type FormValues = {
  password: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const token = searchParams.get('token');

  const onSubmit = async (data: FormValues) => {
    if (!token) {
      toast.error('Neteisinga atkūrimo nuoroda');
      return;
    }

    try {
      await axios.post('/auth/reset-password', {
        token,
        password: data.password
      });
      
      toast.success('Slaptažodis sėkmingai pakeistas!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error('Nepavyko pakeisti slaptažodžio. Bandykite dar kartą.');
    }
  };

  if (!token) {
    return (
      <div className="login-container">
        <div className="login-left">
          <h1 className="login-title">Neteisingas Atkūrimo URL</h1>
          <p>Ši slaptažodžio atkūrimo nuoroda yra neteisinga arba nebegaliojanti.</p>
          <p className="login-register">
            <Link to="/forgot-password">Bandyti dar kartą</Link> | <Link to="/login">Grįžti į prisijungimo puslapį</Link>
          </p>
        </div>
        <div className="login-right">
          <img src="/src/assets/icons/not_found_icon.png" alt="Padangų Montavimas" />
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="login-title">Sukurti naują slaptažodį</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="password-container">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Naujas slaptažodis"
              className="login-input"
            />
            <img
              src={showPassword ? "/src/assets/icons/view.png" : "/src/assets/icons/hide.png"}
              alt={showPassword ? "Hide Password" : "Show Password"}
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          {errors.password && <p className="login-error">{errors.password.message}</p>}
          
          <div className="password-container">
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Pakartokite naują slaptažodį"
              className="login-input"
            />
            <img
              src={showConfirmPassword ? "/src/assets/icons/view.png" : "/src/assets/icons/hide.png"}
              alt={showConfirmPassword ? "Hide Password" : "Show Password"}
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>
          {errors.confirmPassword && <p className="login-error">{errors.confirmPassword.message}</p>}
          
          <button type="submit" className="login-button">Pakeisti slaptažodį</button>
        </form>
        
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