export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <p className="dashboard-description">
        Welcome to the admin panel. Here you can manage users, bookings, and more.
      </p>
      <div className="dashboard-actions">
        <button className="dashboard-button manage-users">Manage Users</button>
        <button className="dashboard-button manage-bookings">Manage Bookings</button>
      </div>
    </div>
  );
}