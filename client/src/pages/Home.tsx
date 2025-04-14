import { Link } from 'react-router-dom';

export default function Home() {
  const token = localStorage.getItem('token');

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.reload();
  };

  return (
    <div>
      <h1>Welcome to Monteina Management</h1>
      {token ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <div>
          <Link to="/login">Log In</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </div>
  );
}