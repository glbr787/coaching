import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import FormField from '../components/ui/FormField';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';

const defaultGoalForm = {
  name: '',
  category: '',
  description: '',
  priority: '2',
  startDate: '',
  targetDate: '',
  status: 'active',
  notes: ''
};

const defaultMetricForm = {
  date: '',
  weight: '',
  waist: '',
  chest: '',
  hips: '',
  arm: '',
  thigh: '',
  bodyFatPercentage: '',
  restingHeartRate: '',
  energyLevel: '',
  sleepQuality: '',
  notes: ''
};

export default function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [goalForm, setGoalForm] = useState(defaultGoalForm);
  const [metricForm, setMetricForm] = useState(defaultMetricForm);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [editingMetric, setEditingMetric] = useState<any>(null);
  const [noteText, setNoteText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const [clientData, goalsData, metricsData, notesData] = await Promise.all([
          api.clients.get(id),
          api.clients.goals.list(id),
          api.clients.metrics.list(id),
          api.clients.notes.list(id)
        ]);

        setClient(clientData);
        setGoals(goalsData);
        setMetrics(metricsData);
        setNotes(notesData);
        setError('');
      } catch (err: any) {
        setError(err.message);
      }
    }

    loadData();
  }, [id]);

  const reloadGoals = async () => {
    if (!id) return;
    const goalsData = await api.clients.goals.list(id);
    setGoals(goalsData);
  };

  const reloadMetrics = async () => {
    if (!id) return;
    const metricsData = await api.clients.metrics.list(id);
    setMetrics(metricsData);
  };

  const addNote = async (event: FormEvent) => {
    event.preventDefault();
    if (!id) return;
    try {
      const note = await api.clients.notes.add(id, noteText);
      setNotes([note, ...notes]);
      setNoteText('');
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const addGoal = async (event: FormEvent) => {
    event.preventDefault();
    if (!id) return;
    try {
      const created = await api.clients.goals.add(id, {
        name: goalForm.name,
        category: goalForm.category,
        description: goalForm.description,
        priority: Number(goalForm.priority),
        startDate: goalForm.startDate || null,
        targetDate: goalForm.targetDate || null,
        status: goalForm.status,
        notes: goalForm.notes || null
      });
      setGoals([created, ...goals]);
      setGoalForm(defaultGoalForm);
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateGoal = async () => {
    if (!editingGoal) return;
    try {
      const updated = await api.goals.update(editingGoal.id, {
        name: editingGoal.name,
        category: editingGoal.category,
        description: editingGoal.description,
        priority: Number(editingGoal.priority),
        startDate: editingGoal.startDate || null,
        targetDate: editingGoal.targetDate || null,
        status: editingGoal.status,
        notes: editingGoal.notes || null
      });
      setGoals(goals.map((goal) => (goal.id === updated.id ? updated : goal)));
      setEditingGoal(null);
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleArchiveGoal = async (goal: any) => {
    try {
      const updated = await api.goals.update(goal.id, {
        archivedAt: goal.archivedAt ? null : new Date().toISOString()
      });
      setGoals(goals.map((item) => (item.id === updated.id ? updated : item)));
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const addMetric = async (event: FormEvent) => {
    event.preventDefault();
    if (!id) return;
    try {
      const created = await api.clients.metrics.add(id, {
        date: metricForm.date,
        weight: metricForm.weight || null,
        waist: metricForm.waist || null,
        chest: metricForm.chest || null,
        hips: metricForm.hips || null,
        arm: metricForm.arm || null,
        thigh: metricForm.thigh || null,
        bodyFatPercentage: metricForm.bodyFatPercentage || null,
        restingHeartRate: metricForm.restingHeartRate || null,
        energyLevel: metricForm.energyLevel || null,
        sleepQuality: metricForm.sleepQuality || null,
        notes: metricForm.notes || null
      });
      setMetrics([created, ...metrics]);
      setMetricForm(defaultMetricForm);
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const startMetricEdit = (metric: any) => {
    setEditingMetric({
      ...metric,
      bodyFatPercentage: metric.bodyFatPercentage ?? '',
      restingHeartRate: metric.restingHeartRate ?? '',
      energyLevel: metric.energyLevel ?? '',
      sleepQuality: metric.sleepQuality ?? ''
    });
  };

  const updateMetric = async () => {
    if (!editingMetric) return;
    try {
      const updated = await api.metrics.update(editingMetric.id, {
        date: editingMetric.date,
        weight: editingMetric.weight || null,
        waist: editingMetric.waist || null,
        chest: editingMetric.chest || null,
        hips: editingMetric.hips || null,
        arm: editingMetric.arm || null,
        thigh: editingMetric.thigh || null,
        bodyFatPercentage: editingMetric.bodyFatPercentage || null,
        restingHeartRate: editingMetric.restingHeartRate || null,
        energyLevel: editingMetric.energyLevel || null,
        sleepQuality: editingMetric.sleepQuality || null,
        notes: editingMetric.notes || null
      });
      setMetrics(metrics.map((metric) => (metric.id === updated.id ? updated : metric)));
      setEditingMetric(null);
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteMetric = async (metricId: string) => {
    if (!window.confirm('Confirmez-vous la suppression de cette mesure ?')) {
      return;
    }
    try {
      await api.metrics.delete(metricId);
      setMetrics(metrics.filter((metric) => metric.id !== metricId));
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!client) return <Card title="Chargement">Chargement du client…</Card>;

  const activeGoals = goals.filter((goal) => !goal.archivedAt && goal.status === 'active').length;
  const latestMetric = metrics[0];

  return (
    <>
      <Header title={`${client.firstName} ${client.lastName}`} subtitle="Fiche client détaillée" />

      <div className="ui-card-grid">
        <Card title="Profil">
          <p><strong>Email :</strong> {client.email || '—'}</p>
          <p><strong>Téléphone :</strong> {client.phone || '—'}</p>
          <p><strong>Objectif principal :</strong> {client.mainGoal || '—'}</p>
          <p><strong>Statut :</strong> {client.status}</p>
          <p><strong>Début :</strong> {client.startDate ? new Date(client.startDate).toLocaleDateString() : '—'}</p>
        </Card>

        <Card title="Résumé du suivi">
          <p><strong>Objectifs actifs :</strong> {activeGoals}</p>
          <p><strong>Objectifs totaux :</strong> {goals.length}</p>
          <p><strong>Mesures enregistrées :</strong> {metrics.length}</p>
          <p><strong>Dernière mesure :</strong> {latestMetric ? new Date(latestMetric.date).toLocaleDateString() : 'Aucune'}</p>
        </Card>
      </div>

      <div className="ui-card-grid">
        <Card title="Objectifs client">
          <form onSubmit={addGoal}>
            <FormField label="Titre">
              <input
                className="ui-input"
                value={goalForm.name}
                onChange={(event) => setGoalForm({ ...goalForm, name: event.target.value })}
              />
            </FormField>
            <FormField label="Catégorie">
              <input
                className="ui-input"
                value={goalForm.category}
                onChange={(event) => setGoalForm({ ...goalForm, category: event.target.value })}
              />
            </FormField>
            <FormField label="Priorité">
              <Select
                value={goalForm.priority}
                onChange={(event) => setGoalForm({ ...goalForm, priority: event.target.value })}
              >
                <option value="1">Faible</option>
                <option value="2">Moyenne</option>
                <option value="3">Élevée</option>
              </Select>
            </FormField>
            <FormField label="Statut">
              <Select
                value={goalForm.status}
                onChange={(event) => setGoalForm({ ...goalForm, status: event.target.value })}
              >
                <option value="active">Actif</option>
                <option value="paused">En pause</option>
                <option value="achieved">Atteint</option>
                <option value="abandoned">Abandonné</option>
              </Select>
            </FormField>
            <FormField label="Date de début">
              <input
                className="ui-input"
                type="date"
                value={goalForm.startDate}
                onChange={(event) => setGoalForm({ ...goalForm, startDate: event.target.value })}
              />
            </FormField>
            <FormField label="Date cible">
              <input
                className="ui-input"
                type="date"
                value={goalForm.targetDate}
                onChange={(event) => setGoalForm({ ...goalForm, targetDate: event.target.value })}
              />
            </FormField>
            <FormField label="Notes">
              <Textarea
                value={goalForm.notes}
                onChange={(event) => setGoalForm({ ...goalForm, notes: event.target.value })}
              />
            </FormField>
            <Button type="submit">Ajouter l’objectif</Button>
          </form>
        </Card>

        <Card title="Mesures de progression">
          <form onSubmit={addMetric}>
            <FormField label="Date">
              <input
                className="ui-input"
                type="date"
                value={metricForm.date}
                onChange={(event) => setMetricForm({ ...metricForm, date: event.target.value })}
              />
            </FormField>
            <FormField label="Poids (kg)">
              <input
                className="ui-input"
                type="number"
                step="0.1"
                value={metricForm.weight}
                onChange={(event) => setMetricForm({ ...metricForm, weight: event.target.value })}
              />
            </FormField>
            <FormField label="Tour de taille (cm)">
              <input
                className="ui-input"
                type="number"
                step="0.1"
                value={metricForm.waist}
                onChange={(event) => setMetricForm({ ...metricForm, waist: event.target.value })}
              />
            </FormField>
            <FormField label="Qualité du sommeil (1-10)">
              <input
                className="ui-input"
                type="number"
                min="1"
                max="10"
                value={metricForm.sleepQuality}
                onChange={(event) => setMetricForm({ ...metricForm, sleepQuality: event.target.value })}
              />
            </FormField>
            <FormField label="Niveau d’énergie (1-10)">
              <input
                className="ui-input"
                type="number"
                min="1"
                max="10"
                value={metricForm.energyLevel}
                onChange={(event) => setMetricForm({ ...metricForm, energyLevel: event.target.value })}
              />
            </FormField>
            <FormField label="Notes">
              <Textarea
                value={metricForm.notes}
                onChange={(event) => setMetricForm({ ...metricForm, notes: event.target.value })}
              />
            </FormField>
            <Button type="submit">Ajouter la mesure</Button>
          </form>
        </Card>
      </div>

      <Card title="Liste des objectifs">
        {goals.length === 0 ? (
          <EmptyState title="Aucun objectif" description="Ajoutez un objectif pour démarrer le suivi." />
        ) : (
          <ul>
            {goals.map((goal) => (
              <li key={goal.id} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <div>
                    <strong>{goal.name}</strong> • {goal.category}
                    <div style={{ fontSize: 13, color: '#555' }}>
                      Priorité {goal.priority}, statut {goal.status}{goal.archivedAt ? ' • archivé' : ''}
                    </div>
                    <div style={{ fontSize: 13, color: '#555' }}>
                      {goal.startDate ? `Début : ${new Date(goal.startDate).toLocaleDateString()}` : ''}
                      {goal.targetDate ? ` • Cible : ${new Date(goal.targetDate).toLocaleDateString()}` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button type="button" onClick={() => setEditingGoal(goal)}>Modifier</Button>
                    <Button type="button" onClick={() => toggleArchiveGoal(goal)}>{goal.archivedAt ? 'Restaurer' : 'Archiver'}</Button>
                  </div>
                </div>
                {editingGoal?.id === goal.id && (
                  <div style={{ marginTop: 10 }}>
                    <FormField label="Titre">
                      <input
                        className="ui-input"
                        value={editingGoal.name}
                        onChange={(event) => setEditingGoal({ ...editingGoal, name: event.target.value })}
                      />
                    </FormField>
                    <FormField label="Catégorie">
                      <input
                        className="ui-input"
                        value={editingGoal.category}
                        onChange={(event) => setEditingGoal({ ...editingGoal, category: event.target.value })}
                      />
                    </FormField>
                    <FormField label="Statut">
                      <Select
                        value={editingGoal.status}
                        onChange={(event) => setEditingGoal({ ...editingGoal, status: event.target.value })}
                      >
                        <option value="active">Actif</option>
                        <option value="paused">En pause</option>
                        <option value="achieved">Atteint</option>
                        <option value="abandoned">Abandonné</option>
                      </Select>
                    </FormField>
                    <FormField label="Notes">
                      <Textarea
                        value={editingGoal.notes || ''}
                        onChange={(event) => setEditingGoal({ ...editingGoal, notes: event.target.value })}
                      />
                    </FormField>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button type="button" onClick={updateGoal}>Enregistrer</Button>
                      <Button type="button" onClick={() => setEditingGoal(null)}>Annuler</Button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Liste des mesures">
        {metrics.length === 0 ? (
          <EmptyState title="Aucune mesure" description="Ajoutez une mesure pour commencer le suivi." />
        ) : (
          <ul>
            {metrics.map((metric) => (
              <li key={metric.id} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <div>
                    <strong>{metric.date ? new Date(metric.date).toLocaleDateString() : 'Date inconnue'}</strong>
                    <div style={{ fontSize: 13, color: '#555' }}>
                      {metric.weight ? `Poids ${metric.weight} kg` : ''}
                      {metric.waist ? ` • Taille ${metric.waist} cm` : ''}
                      {metric.energyLevel ? ` • Énergie ${metric.energyLevel}/10` : ''}
                      {metric.sleepQuality ? ` • Sommeil ${metric.sleepQuality}/10` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Button type="button" onClick={() => startMetricEdit(metric)}>Modifier</Button>
                    <Button type="button" onClick={() => deleteMetric(metric.id)}>Supprimer</Button>
                  </div>
                </div>
                {editingMetric?.id === metric.id && (
                  <div style={{ marginTop: 10 }}>
                    <FormField label="Poids (kg)">
                      <input
                        className="ui-input"
                        value={editingMetric.weight || ''}
                        onChange={(event) => setEditingMetric({ ...editingMetric, weight: event.target.value })}
                      />
                    </FormField>
                    <FormField label="Tour de taille (cm)">
                      <input
                        className="ui-input"
                        value={editingMetric.waist || ''}
                        onChange={(event) => setEditingMetric({ ...editingMetric, waist: event.target.value })}
                      />
                    </FormField>
                    <FormField label="Niveau d’énergie (1-10)">
                      <input
                        className="ui-input"
                        value={editingMetric.energyLevel || ''}
                        onChange={(event) => setEditingMetric({ ...editingMetric, energyLevel: event.target.value })}
                      />
                    </FormField>
                    <FormField label="Qualité du sommeil (1-10)">
                      <input
                        className="ui-input"
                        value={editingMetric.sleepQuality || ''}
                        onChange={(event) => setEditingMetric({ ...editingMetric, sleepQuality: event.target.value })}
                      />
                    </FormField>
                    <FormField label="Notes">
                      <Textarea
                        value={editingMetric.notes || ''}
                        onChange={(event) => setEditingMetric({ ...editingMetric, notes: event.target.value })}
                      />
                    </FormField>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button type="button" onClick={updateMetric}>Enregistrer</Button>
                      <Button type="button" onClick={() => setEditingMetric(null)}>Annuler</Button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Historique des notes">
        {notes.length === 0 ? (
          <EmptyState title="Aucune note" description="Ajoutez une première note de suivi." />
        ) : (
          <ul>
            {notes.map((note) => (
              <li key={note.id} style={{ marginBottom: 10 }}>
                <strong>{new Date(note.createdAt).toLocaleDateString()}</strong> - {note.content}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
