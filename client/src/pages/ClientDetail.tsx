import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';

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

  if (error) return <div className="error">{error}</div>;
  if (!client) return <div className="loading">Chargement du client…</div>;

  return (
    <>
      <h2>{client.firstName} {client.lastName}</h2>
      <div className="card-grid">
        <div className="card">
          <h3>Profil</h3>
          <p><strong>Email :</strong> {client.email || '—'}</p>
          <p><strong>Téléphone :</strong> {client.phone || '—'}</p>
          <p><strong>Objectif principal :</strong> {client.mainGoal || '—'}</p>
          <p><strong>Statut :</strong> {client.status}</p>
          <p><strong>Début :</strong> {client.startDate ? new Date(client.startDate).toLocaleDateString() : '—'}</p>
        </div>
        <div className="card">
          <h3>Notes coach</h3>
          <form onSubmit={addNote}>
            <div className="field">
              <label>Nouvelle note</label>
              <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} />
            </div>
            <button type="submit" className="primary">Ajouter la note</button>
          </form>
        </div>
      </div>
      <div className="card">
        <h3>Historique des notes</h3>
        <ul>
          {notes.map((note) => (
            <li key={note.id} style={{ marginBottom: 12 }}>
              <strong>{new Date(note.createdAt).toLocaleDateString()}</strong> — {note.content}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
