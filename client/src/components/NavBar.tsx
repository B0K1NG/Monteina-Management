import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
        window.location.reload();
    };

    const handleLinkClick = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <NavLink to="/">
                    <img src="../src/assets/logo_monteina.png" alt="Monteina Logotipas" />
                </NavLink>
            </div>
            <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
                <div className="navbar-center">
                    <li><NavLink to="/services" className={({ isActive }) => isActive ? "active" : ""} onClick={handleLinkClick}>Paslaugos</NavLink></li>
                    <li><NavLink to="/faq" className={({ isActive }) => isActive ? "active" : ""} onClick={handleLinkClick}>D.U.K.</NavLink></li>
                    {token && (
                        <>
                            <li><NavLink to="/calendar" className={({ isActive }) => isActive ? "active" : ""} onClick={handleLinkClick}>Kalendorius</NavLink></li>
                            <li><NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""} onClick={handleLinkClick}>Valdymo skydelis</NavLink></li>
                        </>
                    )}
                </div>
                <div className="navbar-right">
                    {token ? (
                        <li><button onClick={handleSignOut} className="btn-logout">Atsijungti</button></li>
                    ) : (
                        <>
                            <li><NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""} onClick={handleLinkClick}>Prisijungti</NavLink></li>
                            <li><NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""} onClick={handleLinkClick}>Sukurti paskyrą</NavLink></li>
                        </>
                    )}
                </div>
            </ul>
        </nav>
    );
}