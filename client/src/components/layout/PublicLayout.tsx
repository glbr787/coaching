import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BRAND_NAME, COPYRIGHT_YEAR } from '../../lib/brand';

interface Props {
  children: ReactNode;
}

export default function PublicLayout({ children }: Props) {
  return (
    <div className="landing-page">
      <header className="landing-topbar">
        <Link to="/" className="landing-brand">{BRAND_NAME}</Link>
        <nav className="landing-nav">
          <a href="/#accompagnement">Accompagnement</a>
          <a href="/#resultats">Résultats</a>
          <Link to="/blog">Blog</Link>
          <Link to="/faq">FAQ</Link>
        </nav>
        <div className="landing-auth-cta desktop-only">
          <Link to="/client/login" className="landing-btn ghost">Se connecter</Link>
          <Link to="/client/register" className="landing-btn solid">S'inscrire</Link>
        </div>
      </header>

      <main className="public-main">{children}</main>

      <footer className="landing-footer">
        <div className="landing-footer-content">
          <p>&copy; {COPYRIGHT_YEAR} {BRAND_NAME}. Tous droits réservés.</p>
          <div className="landing-footer-links">
            <Link to="/legal/mentions-legales">Mentions légales</Link>
            <Link to="/legal/confidentialite">Confidentialité</Link>
            <Link to="/legal/cgv">CGV</Link>
            <Link to="/login" className="landing-admin-link" title="Accès admin">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
