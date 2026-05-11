import PublicLayout from '../components/layout/PublicLayout';
import { BRAND_NAME } from '../lib/brand';

export default function LegalNotice() {
  return (
    <PublicLayout>
      <div className="public-page-shell">
        <section className="public-page-head">
          <p>Mentions légales</p>
          <h1>Informations légales à compléter avant publication</h1>
          <span>
            Cette page contient des champs de référence. Les informations doivent être vérifiées
            et complétées avant toute mise en ligne réelle.
          </span>
        </section>

        <section className="legal-card">
          <h2>Nom commercial</h2>
          <p>{BRAND_NAME}</p>

          <h2>Éditeur du site</h2>
          <p>À compléter</p>

          <h2>Statut juridique</h2>
          <p>À compléter</p>

          <h2>Adresse</h2>
          <p>À compléter</p>

          <h2>Email</h2>
          <p>À compléter</p>

          <h2>Directeur de publication</h2>
          <p>À compléter</p>

          <h2>Hébergeur</h2>
          <p>À compléter</p>
        </section>
      </div>
    </PublicLayout>
  );
}
