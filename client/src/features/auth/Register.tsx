import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const schema = z.object({
  firstName: z.string().min(1, 'Vardas yra privalomas'),
  lastName: z.string().min(1, 'Pavardė yra privaloma'),
  email: z.string().email('Neteisingas el. pašto formatas'),
  password: z.string().min(8, 'Slaptažodis turi būti bent 8 simbolių ilgio'),
});

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      await axios.post('/auth/register', data);
      alert('Registracija sėkminga! Patikrinkite el. pašto dėžutę ir patvirtinkite savo paskyrą.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Registracija nesėkminga. Pamėginkite dar kartą vėliau.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h1 className="register-title">Sukurti Paskyrą</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <input {...register('firstName')} type="text" placeholder="Vardas ir Pavardė" className="register-input" />
          <p className="register-error">{errors.firstName?.message}</p>
          <input {...register('email')} type="email" placeholder="El. paštas" className="register-input" />
          <p className="register-error">{errors.email?.message}</p>
          <div className="password-container">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Slaptažodis"
              className="register-input"
            />
            <img
              src={showPassword ? "/src/assets/icons/view.png" : "/src/assets/icons/hide.png"}
              alt={showPassword ? "Hide Password" : "Show Password"}
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          <p className="register-error">{errors.password?.message}</p>
          <button type="submit" className="register-button">Sukurti Paskyrą</button>
        </form>
        <p className="login-register">
          Jau turite paskyrą? <Link to="/login">Prisijungti</Link>
        </p>
      </div>
      <div className="register-right">
        <div className="blur-background"></div>
        <div className="info-text">
          <h2>Tavo kelionė prasideda nuo tinkamų padangų.</h2>
          <p>Rinkis kokybę ir pasiruošk kiekvienam posūkiui – tiek mieste, tiek trasoje.</p>
        </div>
        <div className="reviewers">
          <img src="/src/assets/icons/Reviewers.png" alt="Reviewers" className="reviewers-image" />
          <div className="reviewers-info">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <img key={i} src="/src/assets/icons/star.png" alt="Star" />
              ))}
              <span>5.0</span>
            </div>
            <p>Daugiau nei 40 atsiliepimų</p>
          </div>
        </div>
      </div>
    </div>
  );
}