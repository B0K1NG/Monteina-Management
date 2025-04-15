export default function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">MONTEINA</h1>
        <p className="home-subtitle">Kur tikslumas susitinka su patikimumu</p>
        <div className="home-buttons">
          <button className="btn-primary">Užsakyti Paslaugą</button>
          <button className="btn-secondary">Sužinoti Daugiau</button>
        </div>
      </header>

      <section className="how-it-works">
        <h2 className="section-title">Kaip tai veikia</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-icon">🚗</div>
            <h3 className="step-title">Pasirinkite laiką</h3>
            <p className="step-description">Išsirinkite jums tinkamą datą ir laiką mūsų sistemoje.</p>
          </div>
          <div className="step">
            <div className="step-icon">💶</div>
            <h3 className="step-title">Sumokėkite avansą</h3>
            <p className="step-description">Rezervacijai patvirtinti užtenka simbolinio avanso.</p>
          </div>
          <div className="step">
            <div className="step-icon">📅</div>
            <h3 className="step-title">Atvykite į servisą</h3>
            <p className="step-description">Atvykite laiku – viskuo pasirūpinsime.</p>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p className="footer-title">Kodėl verta rinktis mus</p>
        <div className="footer-benefits">
          <div className="benefit">✅ Greita ir patogu</div>
          <div className="benefit">✅ Profesionalūs meistrai</div>
          <div className="benefit">✅ Geriausios kainos</div>
          <div className="benefit">✅ Tavo patogumui – internetu</div>
        </div>
      </footer>
    </div>
  );
}

