import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 px-4 z-50">
      <div className="text-center">
        <h1 className="text-7xl font-extrabold text-blue-600">404</h1>
        <p className="mt-4 text-2xl font-semibold text-gray-800">Page Not Found</p>
        <p className="mt-2 text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
