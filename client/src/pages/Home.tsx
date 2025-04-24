import { useNavigate } from 'react-router-dom';

export default function Home() {

  const navigate = useNavigate();

  const handleBookingClick = () => {
    const isAuthenticated = !!localStorage.getItem('token');
    if (isAuthenticated) {
      navigate('/calendar');
    } else {
      navigate('/login');
    };
  };

  const handleMoreClick = () => {
    const isAuthenticated = !!localStorage.getItem('token');
    if (isAuthenticated) {
      navigate('/services');
    } else {
      navigate('/login');
    };
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">MONTEINA</h1>
        <p className="home-subtitle">Kur tikslumas susitinka su patikimumu</p>
        <div className="home-buttons">
          <button onClick={handleBookingClick} className="btn-primary">Užsakyti Paslaugą</button>
          <button onClick={handleMoreClick} className="btn-secondary">Sužinoti Daugiau</button>
        </div>
      </header>

      <section className="how-it-works">
        <h2 className="section-title">Kaip tai veikia</h2>
        <div className="steps-container">
          <div className="step">
            <img src="/src/assets/icons/car_icon.png" alt="Car Icon" className="step-icon" />
            <div className="step-content">
              <h3 className="step-title">Pasirinkite laiką</h3>
              <p className="step-description">
                Išsirinkite jums tinkamą datą ir laiką mūsų sistemoje.
              </p>
            </div>
          </div>

          <div className="step">
            <img src="/src/assets/icons/euro_icon.png" alt="Euro Icon" className="step-icon" />
            <div className="step-content">
              <h3 className="step-title">Sumokėkite avansą</h3>
              <p className="step-description">
                Rezervacijai patvirtinti užtenka simbolinio avanso.
              </p>
            </div>
          </div>

          <div className="step">
            <img src="/src/assets/icons/calendar_icon.png" alt="Calendar Icon" className="step-icon" />
            <div className="step-content">
              <h3 className="step-title">Atvykite į servisą</h3>
              <p className="step-description">
                Atvykite laiku – viskuo pasirūpinsime.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p className="footer-title">Kodėl verta rinktis mus</p>
        <div className="footer-benefits">
          <div className="benefit">
            <img src="/src/assets/icons/check_mark_icon.png" alt="Checkmark Icon" />
            <span>Greita ir patogu</span>
          </div>
          <div className="benefit">
            <img src="/src/assets/icons/like_icon.png" alt="Like Icon" />
            <span>Profesionalūs meistrai</span>
          </div>
          <div className="benefit">
            <img src="/src/assets/icons/bill_icon.png" alt="Invoice Icon" />
            <span>Geriausios kainos</span>
          </div>
          <div className="benefit">
            <img src="/src/assets/icons/wifi_icon.png" alt="Internet Icon" />
            <span>Tavo patogumui – internetu</span>
          </div>
        </div>
      </footer>
    </div>
  );
}