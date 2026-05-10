import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <h1>Coach Local</h1>
          <p className="landing-subtitle">Suivi personnalisé pour vos objectifs fitness</p>
          <button className="landing-cta" onClick={() => navigate('/login')}>
            Acceder au suivi
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <h2>Nos services</h2>
        <div className="landing-features-grid">
          <div className="landing-feature-card">
            <div className="landing-feature-icon">📋</div>
            <h3>Suivi clients</h3>
            <p>Gestion complete des profils, objectifs et historique de progression.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">💪</div>
            <h3>Programmes personnalises</h3>
            <p>Creation et suivi de programmes adaptes a chaque client.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">📚</div>
            <h3>Bibliotheque d'exercices</h3>
            <p>Base complete d'exercices avec descriptions et variantes.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">📊</div>
            <h3>Suivi de progression</h3>
            <p>Notes et mesures de progression pour chaque client.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">🎨</div>
            <h3>Interface moderne</h3>
            <p>Design epure compatible macOS, iOS et Windows.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">🔒</div>
            <h3>Donnees locales</h3>
            <p>Stockage local securise, aucune donnee envoyee en ligne.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta-section">
        <h2>Pret a commencer?</h2>
        <p>Acces securise a votre espace de suivi coaching.</p>
        <button className="landing-cta-primary" onClick={() => navigate('/login')}>
          Se connecter
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-content">
          <p>&copy; 2026 Coach Local. Application locale de suivi coaching.</p>
          <a href="/login" className="landing-admin-link" title="Admin">Admin</a>
        </div>
      </footer>
    </div>
  );
}
