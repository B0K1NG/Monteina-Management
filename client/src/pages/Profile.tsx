export default function Profile() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-semibold mb-4">User Profile</h1>
      <p className="text-lg text-gray-600">
        Welcome to your profile page. Here you can view and manage your bookings.
      </p>
      <button className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
        Manage Bookings
      </button>
    </div>
  );
}