import PublicLayout from '../components/layout/PublicLayout';
import { blogArticles } from '../lib/publicContent';
import { BRAND_NAME } from '../lib/brand';

export default function Blog() {
  return (
    <PublicLayout>
      <div className="public-page-shell">
        <section className="public-page-head">
          <p>Blog {BRAND_NAME}</p>
          <h1>Conseils premium pour progresser sans confusion.</h1>
          <span>10 articles pour mieux s'entraîner, mieux récupérer et tenir dans la durée.</span>
        </section>

        <section className="blog-grid">
          {blogArticles.map((article) => (
            <article key={article.id} className="blog-card">
              <div className="blog-meta">
                <span>{article.category}</span>
                <small>{article.readTime}</small>
              </div>
              <h2>{article.title}</h2>
              <p>{article.excerpt}</p>
            </article>
          ))}
        </section>
      </div>
    </PublicLayout>
  );
}
