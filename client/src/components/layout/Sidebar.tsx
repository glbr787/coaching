import { NavLink } from 'react-router-dom';
import Button from '../ui/Button';

interface Props {
  onLogout: () => void;
}

const links = [
  { to: '/', label: 'Tableau de bord' },
  { to: '/clients', label: 'Clients' },
  { to: '/programs', label: 'Programmes' },
  { to: '/exercises', label: 'Exercices' },
  { to: '/settings', label: 'Paramètres' }
];

export default function Sidebar({ onLogout }: Props) {
  return (
    <aside className="ui-sidebar">
      <div className="ui-sidebar-brand">
        <h1>Coach Local</h1>
        <p>Gestion locale</p>
      </div>
      <nav className="ui-sidebar-nav">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === '/'} className="ui-nav-link">
            {link.label}
          </NavLink>
        ))}
      </nav>
      <Button variant="secondary" onClick={onLogout}>
        Déconnexion
      </Button>
    </aside>
  );
}
