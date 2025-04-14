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
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-800 px-4 z-50">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
        <input
          {...register('firstName')}
          type="text"
          placeholder="First Name"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-red-500 text-sm">{errors.firstName?.message}</p>
        <input
          {...register('lastName')}
          type="text"
          placeholder="Last Name"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-red-500 text-sm">{errors.lastName?.message}</p>
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
          className="w-full px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}