import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { blogArticles, faqs } from '../lib/publicContent';

export default function Landing() {
  const featuredArticles = blogArticles.slice(0, 2);
  const featuredFaqs = faqs.slice(0, 3);

  return (
    <PublicLayout>
      <section className="landing-hero">
        <div className="landing-hero-bg" aria-hidden="true" />
        <div className="landing-hero-content">
          <p className="landing-kicker">Accompagnement sportif personnalisé</p>
          <h1>Une approche structurée, sobre et crédible pour progresser durablement.</h1>
          <p className="landing-subtitle">
            Un cadre clair, un suivi régulier et des ajustements concrets selon votre niveau,
            vos contraintes et votre disponibilité.
          </p>
          <div className="landing-auth-cta">
            <Link to="/client/register" className="landing-btn solid">S'inscrire</Link>
            <Link to="/client/login" className="landing-btn ghost">Se connecter</Link>
          </div>
        </div>
      </section>

      <section id="accompagnement" className="landing-section">
        <div className="landing-section-head">
          <p>L'accompagnement</p>
          <h2>Une progression structurée, sans promesses irréalistes.</h2>
        </div>
        <div className="landing-grid">
          <article className="landing-panel">
            <h3>Plan d'entraînement adapté</h3>
            <p>Un programme défini selon votre niveau, vos contraintes et votre agenda.</p>
          </article>
          <article className="landing-panel">
            <h3>Suivi régulier</h3>
            <p>Des points d'étape pour ajuster le plan et garder une trajectoire cohérente.</p>
          </article>
          <article className="landing-panel">
            <h3>Adaptation continue</h3>
            <p>Les recommandations évoluent selon vos retours, votre récupération et vos priorités.</p>
          </article>
        </div>
      </section>

      <section id="resultats" className="landing-section accent">
        <div className="landing-metrics">
          <div>
            <strong>Évaluation</strong>
            <span>Objectifs définis et cadre de départ clarifié</span>
          </div>
          <div>
            <strong>Structuration</strong>
            <span>Plan progressif et charge d'entraînement adaptée</span>
          </div>
          <div>
            <strong>Suivi</strong>
            <span>Ajustements réguliers selon vos retours</span>
          </div>
        </div>
      </section>

      <section id="faq" className="landing-section">
        <div className="landing-section-head">
          <p>Blog</p>
          <h2>Derniers contenus pour progresser avec méthode.</h2>
        </div>
        <div className="blog-grid compact">
          {featuredArticles.map((article) => (
            <article key={article.id} className="blog-card">
              <div className="blog-meta">
                <span>{article.category}</span>
                <small>{article.readTime}</small>
              </div>
              <h2>{article.title}</h2>
              <p>{article.excerpt}</p>
            </article>
          ))}
        </div>
        <div className="landing-see-more">
          <Link to="/blog" className="landing-btn solid">Voir plus d'articles</Link>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-head">
          <p>Questions fréquentes</p>
          <h2>Les bases pour démarrer sereinement.</h2>
        </div>
        <div className="landing-faq">
          {featuredFaqs.map((item) => (
            <article key={item.id}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
        <div className="landing-see-more">
          <Link to="/faq" className="landing-btn ghost">Voir plus de questions</Link>
        </div>
      </section>

    </PublicLayout>
  );
}
