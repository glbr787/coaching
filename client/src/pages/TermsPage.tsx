import PublicLayout from '../components/layout/PublicLayout';

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="public-page-shell">
        <section className="public-page-head">
          <p>CGV</p>
          <h1>Conditions générales de vente à compléter</h1>
          <span>
            Cette page est un placeholder. Les conditions doivent être rédigées selon votre offre,
            votre statut juridique et vos obligations légales.
          </span>
        </section>

        <section className="legal-card">
          <h2>Objet</h2>
          <p>À compléter.</p>

          <h2>Prestations et tarifs</h2>
          <p>À compléter.</p>

          <h2>Modalités de paiement</h2>
          <p>À compléter.</p>

          <h2>Droit de rétractation</h2>
          <p>À compléter.</p>

          <h2>Responsabilité</h2>
          <p>À compléter.</p>

          <h2>Droit applicable</h2>
          <p>À compléter.</p>
        </section>
      </div>
    </PublicLayout>
  );
}
