import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { api } from './lib/api';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Programs from './pages/Programs';
import Exercises from './pages/Exercises';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Card from './components/ui/Card';

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
    return (
      <div className="ui-auth-shell">
        <Card title="Chargement">
          <p>Initialisation de l'application…</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="ui-app-shell">
      {user && <Sidebar onLogout={handleLogout} />}
      <main className="ui-main">
        {user && (
          <Header
            title="Coach Local"
            subtitle="Application locale de suivi coaching"
            rightSlot={<span className="ui-session-pill">Session active</span>}
          />
        )}
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
