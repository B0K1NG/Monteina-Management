export default function Dashboard() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-lg text-gray-600 mb-4">
        Welcome to the admin panel. Here you can manage users, bookings, and more.
      </p>
      <div className="space-x-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
          Manage Users
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition">
          Manage Bookings
        </button>
      </div>
    </div>
  );
}