import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import Card from '../components/ui/Card';
import Header from '../components/layout/Header';
import Alert from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.dashboard()
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!stats) return <Card title="Tableau de bord">Chargement du tableau de bord…</Card>;

  return (
    <>
      <Header title="Tableau de bord" subtitle="Vue synthétique de l'activité coaching" />

      <div className="ui-card-grid">
        <Card title="Clients totaux"><p>{stats.totalClients}</p></Card>
        <Card title="Clients actifs"><p>{stats.activeClients}</p></Card>
        <Card title="Clients en pause"><p>{stats.pausedClients}</p></Card>
        <Card title="Programmes en cours"><p>{stats.programsCount}</p></Card>
        <Card title="Suivis nutritionnels"><p>{stats.nutritionProfiles}</p></Card>
      </div>

      <div className="ui-section-stack" style={{ marginTop: 16 }}>
        <Card title="Objectifs les plus fréquents">
          {stats.topGoals.length === 0 ? (
            <EmptyState title="Aucun objectif saisi" description="Ajoutez des objectifs clients pour enrichir cette vue." />
          ) : (
            <ul>
              {stats.topGoals.map((goal: any) => (
                <li key={goal.name}>
                  {goal.name} ({goal.count})
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="ui-section-stack" style={{ marginTop: 16 }}>
        <Card title="Dernières notes coach">
          {stats.recentNotes.length === 0 ? (
            <EmptyState title="Aucune note" description="Les dernières notes client apparaîtront ici." />
          ) : (
            <ul>
              {stats.recentNotes.map((note: any) => (
                <li key={note.id}>
                  <strong>
                    {note.firstName} {note.lastName}
                  </strong>{' '}
                  - {note.content}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
