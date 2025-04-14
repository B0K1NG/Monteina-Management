import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  email: z.string().email(),
  password: z.string()
});

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post('/auth/login', data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

      console.log(`User with ID: ${response.data.id} and Role: ${response.data.role} signed in and redirected to ${response.data.role === 'admin' ? '/dashboard' : '/'} page.`);

      if (response.data.role === 'admin') {
        navigate('/dashboard');
      } else if (response.data.role === 'client') {
        navigate('/');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      alert('Prisijungimas nesėkmingas. Patikrinkite savo el. pašto adresą ir slaptažodį.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder="El. pašto adresas" />
      <p>{errors.email?.message}</p>
      <input {...register('password')} type="password" placeholder="Slaptažodis" />
      <p>{errors.password?.message}</p>
      <button type="submit">Prisijungti</button>
    </form>
  );
}