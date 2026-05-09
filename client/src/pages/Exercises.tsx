import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../lib/api';

const emptyExercise = {
  name: '',
  category: 'Force',
  primaryMuscle: '',
  level: 'Débutant'
};

export default function Exercises() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [form, setForm] = useState<any>(emptyExercise);
  const [error, setError] = useState('');

  useEffect(() => {
    api.exercises.list().then(setExercises).catch((err) => setError(err.message));
  }, []);

  const createExercise = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const newExercise = await api.exercises.create(form);
      setExercises([newExercise, ...exercises]);
      setForm(emptyExercise);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <h2>Bibliothèque d’exercices</h2>
      <div className="form-card">
        <h3>Ajouter un exercice</h3>
        <form onSubmit={createExercise}>
          <div className="field">
            <label>Nom</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Catégorie</label>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="field">
            <label>Muscle principal</label>
            <input value={form.primaryMuscle} onChange={(e) => setForm({ ...form, primaryMuscle: e.target.value })} />
          </div>
          <div className="field">
            <label>Niveau</label>
            <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
              <option>Débutant</option>
              <option>Intermédiaire</option>
              <option>Avancé</option>
            </select>
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="primary">Ajouter</button>
        </form>
      </div>
      <div className="card">
        <h3>Exercices</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Muscle</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise) => (
              <tr key={exercise.id}>
                <td>{exercise.name}</td>
                <td>{exercise.category}</td>
                <td>{exercise.primaryMuscle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
