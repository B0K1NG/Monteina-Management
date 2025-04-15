import { Link } from 'react-router-dom';
import "../scss/pages/_notfound.scss";

export default function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-subtitle">Page Not Found</p>
        <p className="notfound-description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="notfound-button">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
