import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../lib/api';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import FormField from '../components/ui/FormField';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Table from '../components/ui/Table';
import EmptyState from '../components/ui/EmptyState';

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
      <Header title="Programmes" subtitle="Conception de plans d'entraînement simples" />
      <Card title="Créer un programme simple">
        <form onSubmit={createProgram}>
          <FormField label="Nom du programme">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </FormField>
          <FormField label="Description">
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </FormField>
          <FormField label="Durée (semaines)">
            <Input type="number" value={form.durationWeeks} onChange={(e) => setForm({ ...form, durationWeeks: Number(e.target.value) })} />
          </FormField>
          <FormField label="Séances par semaine">
            <Input type="number" value={form.sessionsPerWeek} onChange={(e) => setForm({ ...form, sessionsPerWeek: Number(e.target.value) })} />
          </FormField>
          <FormField label="Objectif">
            <Input value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} />
          </FormField>
          {error && <Alert variant="danger">{error}</Alert>}
          <Button type="submit">Créer</Button>
        </form>
      </Card>
      <Card title="Liste des programmes">
        {programs.length === 0 ? (
          <EmptyState title="Aucun programme" description="Créez un modèle simple pour démarrer." />
        ) : (
        <Table>
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
                <td>{program.durationWeeks ? `${program.durationWeeks} sem.` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        )}
      </Card>
    </>
  );
}
