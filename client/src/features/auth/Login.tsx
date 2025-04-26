import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';

import axios from '../../api/axios';

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post('/auth/login', data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      window.location.href = response.data.role === 'admin' ? '/dashboard' : '/';
    } catch (error) {
      console.error(error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="login-title">Prisijungti</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <input
            {...register('email')}
            type="email"
            placeholder="El. paštas"
            className="login-input"
          />
          <p className="login-error">{errors.email?.message}</p>
          <div className="password-container">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Slaptažodis"
              className="login-input"
            />
            <img
              src={showPassword ? "/src/assets/icons/view.png" : "/src/assets/icons/hide.png"}
              alt={showPassword ? "Hide Password" : "Show Password"}
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          <p className="login-error">{errors.password?.message}</p>
          <button type="submit" className="login-button">Prisijungti</button>
        </form>
        <div className="login-social">
          <div className="separator">
            <img src="/src/assets/icons/Separator.png" alt="Separator Line" />
            <span>Arba prisijunkite su</span>
            <img src="/src/assets/icons/Separator.png" alt="Separator Line" />
          </div>
          <div className="social-icons">
            <img src="/src/assets/icons/gmail_logo.png" alt="Gmail" />
            <img src="/src/assets/icons/facebook_logo.png" alt="Facebook" />
            <img src="/src/assets/icons/apple_logo.png" alt="Apple" />
          </div>
        </div>
        <p className="login-register">
          Dar neturite paskyros? <Link to="/register">Sukurkite paskyrą</Link>
        </p>
      </div>
      <div className="login-right">
        <img src="/src/assets/icons/not_found_icon.png" alt="Padangų Montavimas" />
      </div>
    </div>
  );
}