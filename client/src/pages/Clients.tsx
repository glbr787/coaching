import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

const emptyClient = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  status: 'active'
};

export default function Clients() {
  const [clients, setClients] = useState<any[]>([]);
  const [form, setForm] = useState<any>(emptyClient);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.clients.list()
      .then(setClients)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const newClient = await api.clients.create(form);
      setClients([newClient, ...clients]);
      setForm(emptyClient);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <h2>Clients</h2>
      <div className="form-card">
        <h3>Ajouter un client</h3>
        <form onSubmit={handleCreate}>
          <div className="field">
            <label>Prénom</label>
            <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div className="field">
            <label>Nom</label>
            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <label>Téléphone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="field">
            <label>Statut</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">Actif</option>
              <option value="pause">Pause</option>
              <option value="terminated">Terminé</option>
              <option value="prospect">Prospect</option>
            </select>
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="primary">Créer un client</button>
        </form>
      </div>

      <div className="card">
        <h3>Liste des clients</h3>
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td><Link to={`/clients/${client.id}`}>{client.firstName} {client.lastName}</Link></td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td><span className={`status-pill status-${client.status}`}>{client.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
