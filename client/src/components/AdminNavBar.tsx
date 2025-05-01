import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo_monteina.png';

export default function AdminNavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleSignOut = () => {
    setMenuOpen(false);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
    window.location.reload();
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar admin-navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Monteina Logotipas" />
      </div>

      <div
        role="button"
        aria-label={menuOpen ? 'Užverti meniu' : 'Atidaryti meniu'}
        aria-expanded={menuOpen}
        className={`hamburger ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(open => !open)}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') setMenuOpen(open => !open); }}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>

      <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>        
        <li className="navbar-center">
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={handleLinkClick}
          >
            Užsakymų valdymas
          </NavLink>
        </li>
        <li className="navbar-center">
          <NavLink
            to="/admin/services"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={handleLinkClick}
          >
            Paslaugų valdymas
          </NavLink>
        </li>
        {token && (
          <>
            <li className="navbar-center">
              <NavLink
                to="/admin/users"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={handleLinkClick}
              >
                Vartotojų valdymas
              </NavLink>
            </li>
            <li className="navbar-center">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={handleLinkClick}
              >
                Valdymo skydelis
              </NavLink>
            </li>
          </>
        )}

        <li className="navbar-right">
          {token ? (
            <button onClick={handleSignOut} className="btn-logout">
              Atsijungti
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={handleLinkClick}
              >
                Prisijungti
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={handleLinkClick}
              >
                Sukurti paskyrą
              </NavLink>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
}
