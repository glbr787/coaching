import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import Card from '../components/ui/Card';
import FormField from '../components/ui/FormField';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

interface Props {
  onLogin: (data: { userId: string }) => void;
}

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('changeme');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.login(email, password);
      const me = await api.me();
      onLogin(me);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ui-auth-shell">
      <Card
        title="Connexion admin"
        subtitle="Accès local sécurisé au tableau de pilotage"
        className="ui-auth-card"
      >
        <form onSubmit={handleSubmit}>
          <FormField label="Email">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </FormField>
          <FormField label="Mot de passe">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </FormField>
          {error && <Alert variant="danger">{error}</Alert>}
          <div style={{ marginTop: 10 }}>
            <Button type="submit" block disabled={loading}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
