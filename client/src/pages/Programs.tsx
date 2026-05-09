import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../lib/api';

const emptyProgram = {
  name: '',
  description: '',
  durationWeeks: 4,
  sessionsPerWeek: 3,
  goal: ''
};

export default function Programs() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [form, setForm] = useState<any>(emptyProgram);
  const [error, setError] = useState('');

  useEffect(() => {
    api.programs.list().then(setPrograms).catch((err) => setError(err.message));
  }, []);

  const createProgram = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const newProgram = await api.programs.create(form);
      setPrograms([newProgram, ...programs]);
      setForm(emptyProgram);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <h2>Programmes</h2>
      <div className="form-card">
        <h3>Créer un programme simple</h3>
        <form onSubmit={createProgram}>
          <div className="field">
            <label>Nom du programme</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="field">
            <label>Durée (semaines)</label>
            <input type="number" value={form.durationWeeks} onChange={(e) => setForm({ ...form, durationWeeks: Number(e.target.value) })} />
          </div>
          <div className="field">
            <label>Séances par semaine</label>
            <input type="number" value={form.sessionsPerWeek} onChange={(e) => setForm({ ...form, sessionsPerWeek: Number(e.target.value) })} />
          </div>
          <div className="field">
            <label>Objectif</label>
            <input value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="primary">Créer</button>
        </form>
      </div>
      <div className="card">
        <h3>Liste des programmes</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Objectif</th>
              <th>Durée</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program.id}>
                <td>{program.name}</td>
                <td>{program.goal}</td>
                <td>{program.durationWeeks ? `${program.durationWeeks} sem.` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
