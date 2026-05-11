import { Link, useLocation } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';

export default function ClientAccess() {
  const location = useLocation();
  const isRegister = location.pathname.includes('/register');

  return (
    <PublicLayout>
      <div className="client-access-shell">
        <div className="client-access-card">
          <p className="client-access-kicker">Espace client</p>
          <h1>{isRegister ? 'Inscription bientot disponible' : 'Connexion bientot disponible'}</h1>
          <p>
            Cette etape sera activee dans la prochaine version publique. En attendant, vous pouvez
            demander un acces directement au coach.
          </p>
          <div className="client-access-actions">
            <Link to="/" className="client-access-btn primary">Retour a la vitrine</Link>
            <Link to={isRegister ? '/client/login' : '/client/register'} className="client-access-btn secondary">
              {isRegister ? 'Deja client ? Se connecter' : "Nouveau client ? S'inscrire"}
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
