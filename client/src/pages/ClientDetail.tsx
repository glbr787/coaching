import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import FormField from '../components/ui/FormField';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';

export default function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [noteText, setNoteText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.clients.get(id)
      .then(setClient)
      .catch((err) => setError(err.message));
    api.clients.notes.list(id)
      .then(setNotes)
      .catch((err) => setError(err.message));
  }, [id]);

  const addNote = async (event: FormEvent) => {
    event.preventDefault();
    if (!id) return;
    try {
      const note = await api.clients.notes.add(id, noteText);
      setNotes([note, ...notes]);
      setNoteText('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!client) return <Card title="Chargement">Chargement du client…</Card>;

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
        <Card title="Notes coach">
          <form onSubmit={addNote}>
            <FormField label="Nouvelle note">
              <Textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} />
            </FormField>
            <Button type="submit">Ajouter la note</Button>
          </form>
        </Card>
      </div>
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
