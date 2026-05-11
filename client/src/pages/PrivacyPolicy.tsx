import PublicLayout from '../components/layout/PublicLayout';
import { BRAND_NAME } from '../lib/brand';

export default function PrivacyPolicy() {
  return (
    <PublicLayout>
      <div className="public-page-shell">
        <section className="public-page-head">
          <p>Politique de confidentialité</p>
          <h1>Texte de confidentialité à adapter avant publication</h1>
          <span>
            Ce contenu est une base de travail. Il doit être validé juridiquement selon l'activité
            réelle de {BRAND_NAME}.
          </span>
        </section>

        <section className="legal-card">
          <h2>Principe général</h2>
          <p>
            Les modalités de collecte et de traitement des données personnelles sont à compléter.
          </p>

          <h2>Données concernées</h2>
          <p>À compléter selon les données effectivement collectées.</p>

          <h2>Finalités</h2>
          <p>À compléter selon les usages réels.</p>

          <h2>Durée de conservation</h2>
          <p>À compléter.</p>

          <h2>Droits des personnes</h2>
          <p>À compléter (accès, rectification, suppression, opposition).</p>

          <h2>Contact RGPD</h2>
          <p>À compléter.</p>
        </section>
      </div>
    </PublicLayout>
  );
}
