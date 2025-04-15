import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

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
      <h1 className="register-title">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="register-form">
        <input {...register('firstName')} type="text" placeholder="First Name" className="register-input" />
        <p className="register-error">{errors.firstName?.message}</p>
        <input {...register('lastName')} type="text" placeholder="Last Name" className="register-input" />
        <p className="register-error">{errors.lastName?.message}</p>
        <input {...register('email')} type="email" placeholder="Email" className="register-input" />
        <p className="register-error">{errors.email?.message}</p>
        <input {...register('password')} type="password" placeholder="Password" className="register-input" />
        <p className="register-error">{errors.password?.message}</p>
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
}