import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../lib/api';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import FormField from '../components/ui/FormField';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import Alert from '../components/ui/Alert';
import { useTheme } from '../theme';

const tabs = [
  { key: 'general', label: 'Général' },
  { key: 'appearance', label: 'Apparence' }
] as const;

const accentPresets = ['#2f7cf6', '#13a37f', '#e96f3f', '#8b6cf9', '#eb4f74', '#f59e0b'];

export default function Settings() {
  const [settings, setSettings] = useState<any>(null);
  const [edited, setEdited] = useState<any>({});
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<string>('general');
  const { mode, setMode, accent, setAccent, density, setDensity } = useTheme();

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

  if (!settings) return <Card title="Paramètres">Chargement des paramètres…</Card>;

  return (
    <>
      <Header title="Paramètres" subtitle="Configuration locale du cabinet et apparence" />
      <Tabs tabs={tabs.map((tab) => ({ key: tab.key, label: tab.label }))} value={activeTab} onChange={setActiveTab} />

      {activeTab === 'general' && (
        <Card title="Informations coach">
          <form onSubmit={save}>
            <FormField label="Nom du coach">
              <Input value={edited.coachName || ''} onChange={(e) => setEdited({ ...edited, coachName: e.target.value })} />
            </FormField>
            <FormField label="Nom commercial">
              <Input value={edited.businessName || ''} onChange={(e) => setEdited({ ...edited, businessName: e.target.value })} />
            </FormField>
            <FormField label="Email">
              <Input value={edited.email || ''} onChange={(e) => setEdited({ ...edited, email: e.target.value })} />
            </FormField>
            <FormField label="Téléphone">
              <Input value={edited.phone || ''} onChange={(e) => setEdited({ ...edited, phone: e.target.value })} />
            </FormField>
            <FormField label="Avertissement nutrition / santé">
              <Textarea value={edited.nutritionAdvice || ''} onChange={(e) => setEdited({ ...edited, nutritionAdvice: e.target.value })} />
            </FormField>
            <Button type="submit">Enregistrer</Button>
            {message && <div style={{ marginTop: 12 }}><Alert variant="success">{message}</Alert></div>}
          </form>
        </Card>
      )}

      {activeTab === 'appearance' && (
        <Card title="Apparence">
          <FormField label="Thème">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button variant={mode === 'light' ? 'primary' : 'secondary'} onClick={() => setMode('light')} type="button">Clair</Button>
              <Button variant={mode === 'dark' ? 'primary' : 'secondary'} onClick={() => setMode('dark')} type="button">Sombre</Button>
              <Button variant={mode === 'system' ? 'primary' : 'secondary'} onClick={() => setMode('system')} type="button">Système</Button>
            </div>
          </FormField>

          <FormField label="Couleur d'accent">
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {accentPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className="ui-accent-chip"
                  style={{ background: preset, borderColor: accent === preset ? 'var(--text)' : 'transparent' }}
                  onClick={() => setAccent(preset)}
                  aria-label={`Accent ${preset}`}
                />
              ))}
            </div>
          </FormField>

          <FormField label="Densité d'affichage">
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant={density === 'comfortable' ? 'primary' : 'secondary'} onClick={() => setDensity('comfortable')} type="button">Confortable</Button>
              <Button variant={density === 'compact' ? 'primary' : 'secondary'} onClick={() => setDensity('compact')} type="button">Compacte</Button>
            </div>
          </FormField>
        </Card>
      )}
    </>
  );
}
