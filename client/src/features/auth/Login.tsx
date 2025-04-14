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
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-800 px-4 z-50">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-red-500 text-sm">{errors.password?.message}</p>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}