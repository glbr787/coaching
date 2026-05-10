import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../lib/api';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import FormField from '../components/ui/FormField';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Table from '../components/ui/Table';
import EmptyState from '../components/ui/EmptyState';

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
      <Header title="Bibliothèque d'exercices" subtitle="Catalogue des mouvements et variantes" />
      <Card title="Ajouter un exercice">
        <form onSubmit={createExercise}>
          <FormField label="Nom">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </FormField>
          <FormField label="Catégorie">
            <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </FormField>
          <FormField label="Muscle principal">
            <Input value={form.primaryMuscle} onChange={(e) => setForm({ ...form, primaryMuscle: e.target.value })} />
          </FormField>
          <FormField label="Niveau">
            <Select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
              <option>Débutant</option>
              <option>Intermédiaire</option>
              <option>Avancé</option>
            </Select>
          </FormField>
          {error && <Alert variant="danger">{error}</Alert>}
          <Button type="submit">Ajouter</Button>
        </form>
      </Card>
      <Card title="Exercices">
        {exercises.length === 0 ? (
          <EmptyState title="Aucun exercice" description="Ajoutez vos premiers mouvements de référence." />
        ) : (
        <Table>
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
        </Table>
        )}
      </Card>
    </>
  );
}
