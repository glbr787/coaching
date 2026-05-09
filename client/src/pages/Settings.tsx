import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../lib/api';

export default function Settings() {
  const [settings, setSettings] = useState<any>(null);
  const [edited, setEdited] = useState<any>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.settings.get().then((data) => {
      setSettings(data);
      setEdited(data);
    });
  }, []);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    const updated = await api.settings.update(edited);
    setSettings(updated);
    setMessage('Paramètres enregistrés.');
    setTimeout(() => setMessage(''), 3000);
  };

  if (!settings) return <div className="loading">Chargement des paramètres…</div>;

  return (
    <>
      <h2>Paramètres</h2>
      <div className="form-card">
        <form onSubmit={save}>
          <div className="field">
            <label>Nom du coach</label>
            <input value={edited.coachName || ''} onChange={(e) => setEdited({ ...edited, coachName: e.target.value })} />
          </div>
          <div className="field">
            <label>Nom commercial</label>
            <input value={edited.businessName || ''} onChange={(e) => setEdited({ ...edited, businessName: e.target.value })} />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={edited.email || ''} onChange={(e) => setEdited({ ...edited, email: e.target.value })} />
          </div>
          <div className="field">
            <label>Téléphone</label>
            <input value={edited.phone || ''} onChange={(e) => setEdited({ ...edited, phone: e.target.value })} />
          </div>
          <div className="field">
            <label>Avertissement nutrition / santé</label>
            <textarea value={edited.nutritionAdvice || ''} onChange={(e) => setEdited({ ...edited, nutritionAdvice: e.target.value })} />
          </div>
          <button type="submit" className="primary">Enregistrer</button>
          {message && <div style={{ marginTop: 16 }}>{message}</div>}
        </form>
      </div>
    </>
  );
}
