import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.dashboard()
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (!stats) return <div className="loading">Chargement du tableau de bord…</div>;

  return (
    <>
      <h2>Tableau de bord</h2>
      <div className="card-grid">
        <div className="card">
          <strong>Clients totaux</strong>
          <p>{stats.totalClients}</p>
        </div>
        <div className="card">
          <strong>Clients actifs</strong>
          <p>{stats.activeClients}</p>
        </div>
        <div className="card">
          <strong>Clients en pause</strong>
          <p>{stats.pausedClients}</p>
        </div>
        <div className="card">
          <strong>Programmes</strong>
          <p>{stats.programsCount}</p>
        </div>
        <div className="card">
          <strong>Suivi nutritionnel</strong>
          <p>{stats.nutritionProfiles}</p>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div className="card">
          <h3>Objectifs les plus fréquents</h3>
          <ul>
            {stats.topGoals.map((goal: any) => (
              <li key={goal.name}>{goal.name} ({goal._count.name})</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div className="card">
          <h3>Dernières notes</h3>
          <ul>
            {stats.recentNotes.map((note: any) => (
              <li key={note.id}>
                <strong>{note.client?.firstName} {note.client?.lastName}</strong> — {note.content}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
