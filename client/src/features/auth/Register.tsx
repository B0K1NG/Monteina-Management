import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  firstName: z.string().min(1, 'Vardas yra privalomas'),
  lastName: z.string().min(1, 'Pavardė yra privaloma'),
  email: z.string().email(),
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName')} placeholder="Vardas" />
      <p>{errors.firstName?.message}</p>
      <input {...register('lastName')} placeholder="Pavardė" />
      <p>{errors.lastName?.message}</p>
      <input {...register('email')} placeholder="El. pašto adresas" />
      <p>{errors.email?.message}</p>
      <input {...register('password')} type="password" placeholder="Slaptažodis" />
      <p>{errors.password?.message}</p>
      <button type="submit">Sukurti Paskyrą</button>
    </form>
  );
}