import { Link } from 'react-router-dom';

export default function Home() {
  const token = localStorage.getItem('token');

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-800 px-4 z-50">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Welcome to Monteina Management
      </h1>

      {token ? (
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      ) : (
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}
