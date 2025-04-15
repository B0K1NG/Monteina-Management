import "../scss/pages/_profile.scss";

export default function Profile() {
  return (
    <div className="profile-container">
      <h1 className="profile-title">User Profile</h1>
      <p className="profile-description">
        Welcome to your profile page. Here you can view and manage your bookings.
      </p>
      <button className="profile-button">Manage Bookings</button>
    </div>
  );
}