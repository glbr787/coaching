import { useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { api } from './lib/api';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Programs from './pages/Programs';
import Exercises from './pages/Exercises';
import Settings from './pages/Settings';
import Login from './pages/Login';

function App() {
  const [user, setUser] = useState<{ userId: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.me()
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="app-shell">
      {user && (
        <aside className="sidebar">
          <h1>Coach Local</h1>
          <nav>
            <NavLink to="/" end>Tableau de bord</NavLink>
            <NavLink to="/clients">Clients</NavLink>
            <NavLink to="/programs">Programmes</NavLink>
            <NavLink to="/exercises">Exercices</NavLink>
            <NavLink to="/settings">Paramètres</NavLink>
          </nav>
          <button className="secondary" style={{ marginTop: '1rem' }} onClick={handleLogout}>
            Déconnexion
          </button>
        </aside>
      )}
      <main className="main">
        <div className="topbar">
          <div>{user ? `Connecté` : 'Non connecté'}</div>
        </div>
        <Routes>
          <Route path="/login" element={<Login onLogin={(data) => setUser(data)} />} />
          <Route
            path="/"
            element={user ? <Dashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/clients"
            element={user ? <Clients /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/clients/:id"
            element={user ? <ClientDetail /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/programs"
            element={user ? <Programs /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/exercises"
            element={user ? <Exercises /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/settings"
            element={user ? <Settings /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
