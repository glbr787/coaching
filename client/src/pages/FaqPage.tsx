import PublicLayout from '../components/layout/PublicLayout';
import { faqs } from '../lib/publicContent';
import { BRAND_NAME } from '../lib/brand';

export default function FaqPage() {
  return (
    <PublicLayout>
      <div className="public-page-shell">
        <section className="public-page-head">
          <p>FAQ {BRAND_NAME}</p>
          <h1>Les réponses aux questions les plus fréquentes.</h1>
          <span>Tout ce qu'il faut savoir avant de commencer votre accompagnement.</span>
        </section>

        <section className="faq-grid-full">
          {faqs.map((item) => (
            <article key={item.id} className="faq-card-full">
              <h2>{item.question}</h2>
              <p>{item.answer}</p>
            </article>
          ))}
        </section>
      </div>
    </PublicLayout>
  );
}
