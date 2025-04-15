import "../scss/components/_navbar.scss";
import { Link } from "react-router-dom";

export default function NavBar() {
    const token = localStorage.getItem("token");

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <img src="logo-monteina.png" alt="Monteina Logotipas" />
                </Link>
            </div>
            <ul className="navbar-links">
                <li><a href="/services">Paslaugos</a></li>
                {token ? (
                    <>
                        <li><a href="/calendar">Kalendorius</a></li>
                        <li><a href="/profile">Valdymo skydelis</a></li>
                        <li><button onClick={handleSignOut} className="btn-logout">Atsijungti</button></li>
                    </>
                ) : (
                    <>
                        <li><a href="/faq">D.U.K.</a></li>
                        <li><a href="/login">Prisijungti</a></li>
                        <li><a href="/register">Sukurti paskyrą</a></li>
                    </>
                )}
            </ul>
        </nav>
    );
}