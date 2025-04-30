import { Link } from 'react-router-dom';
import '../../assets/icons/not_found_icon.png';

export default function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">Ups! Čia nieko nėra.</h1>
        <p className="notfound-subtitle">Atrodo, pasukote ne tuo keliu – šitas puslapis pasiklydo.</p>
        <Link to="/" className="notfound-button">
          Grįžkite į pagrindinį puslapį ir tęskite kelionę. <span className='notfound-arrow'>{'→'}</span>
        </Link>
      </div>
      <div className="notfound-image">
      <img src="/src/assets/icons/not_found_icon.png" alt="Padangų Montavimas" />
      </div>
    </div>
  );
}
