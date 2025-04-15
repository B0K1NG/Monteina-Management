import { Link } from 'react-router-dom';
import '../../public/not-found-icon.png';

export default function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">Ups! Čia nieko nėra.</h1>
        <p className="notfound-subtitle">Atrodo, pasukote ne tuo keliu – šitas puslapis pasiklydo.</p>
        <Link to="/" className="notfound-button">
          Grįžkite į pagrindinį puslapį ir tęskite kelionę.
        </Link>
      </div>
      <div className="notfound-image">
        <img src="/not-found-icon.png" alt="404 Illustration" />
      </div>
    </div>
  );
}
