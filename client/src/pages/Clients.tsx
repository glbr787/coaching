import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import FormField from '../components/ui/FormField';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Table from '../components/ui/Table';
import Badge, { type BadgeVariant } from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';

const emptyClient = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  status: 'active'
};

const emptyEditClient = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  status: 'active'
};

const allowedStatuses = ['active', 'pause', 'terminated', 'prospect'] as const;

type ClientStatus = (typeof allowedStatuses)[number];
type ClientForm = typeof emptyClient;

function getStatusVariant(status: string): BadgeVariant {
  if (status === 'active') return 'success';
  if (status === 'pause') return 'warning';
  if (status === 'terminated') return 'danger';
  return 'default';
}

function getStatusLabel(status: string): string {
  if (status === 'active') return 'Actif';
  if (status === 'pause') return 'Pause';
  if (status === 'terminated') return 'Terminé';
  if (status === 'prospect') return 'Prospect';
  return status;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateClientForm(form: ClientForm): string {
  if (!form.firstName.trim()) return 'Le prénom est obligatoire.';
  if (!form.lastName.trim()) return 'Le nom est obligatoire.';
  if (form.email.trim() && !isValidEmail(form.email.trim())) return 'L\'adresse email n\'est pas valide.';
  if (form.phone.trim() && !/^[+\d()\s.-]{6,20}$/.test(form.phone.trim())) return 'Le numéro de téléphone n\'est pas valide.';
  if (!allowedStatuses.includes(form.status as ClientStatus)) return 'Le statut sélectionné est invalide.';
  return '';
}

function sanitizeClientForm(form: ClientForm): ClientForm {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    status: form.status
  };
}

export default function Clients() {
  const [clients, setClients] = useState<any[]>([]);
  const [form, setForm] = useState<ClientForm>(emptyClient);
  const [createError, setCreateError] = useState('');
  const [listError, setListError] = useState('');
  const [editError, setEditError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ClientStatus>('all');
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ClientForm>(emptyEditClient);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.clients
      .list()
      .then(setClients)
      .catch((err) => setListError(err.message || 'Impossible de charger la liste des clients.'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    setCreateError('');
    setSuccessMessage('');

    const payload = sanitizeClientForm(form);
    const validationError = validateClientForm(payload);
    if (validationError) {
      setCreateError(validationError);
      return;
    }

    try {
      const newClient = await api.clients.create(payload);
      setClients((prev) => [newClient, ...prev]);
      setForm(emptyClient);
      setSuccessMessage('Client créé avec succès.');
    } catch (err: any) {
      setCreateError(err.message || 'La création du client a échoué.');
    }
  };

  const startEditing = (client: any) => {
    setEditError('');
    setSuccessMessage('');
    setEditingClientId(client.id);
    setEditForm({
      firstName: client.firstName || '',
      lastName: client.lastName || '',
      email: client.email || '',
      phone: client.phone || '',
      status: client.status || 'active'
    });
  };

  const cancelEditing = () => {
    setEditingClientId(null);
    setEditForm(emptyEditClient);
    setEditError('');
  };

  const saveEditing = async (clientId: string) => {
    setEditError('');
    setSuccessMessage('');

    const payload = sanitizeClientForm(editForm);
    const validationError = validateClientForm(payload);
    if (validationError) {
      setEditError(validationError);
      return;
    }

    try {
      const updatedClient = await api.clients.update(clientId, payload);
      setClients((prev) => prev.map((client) => (client.id === clientId ? updatedClient : client)));
      setEditingClientId(null);
      setEditForm(emptyEditClient);
      setSuccessMessage('Client mis à jour avec succès.');
    } catch (err: any) {
      setEditError(err.message || 'La mise à jour du client a échoué.');
    }
  };

  const query = searchQuery.trim().toLowerCase();
  const filteredClients = clients.filter((client) => {
    if (statusFilter !== 'all' && client.status !== statusFilter) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = `${client.firstName || ''} ${client.lastName || ''} ${client.email || ''} ${client.phone || ''}`.toLowerCase();
    return haystack.includes(query);
  });

  return (
    <>
      <Header title="Clients" subtitle="Gestion des profils et du statut d'accompagnement" />

      <Card title="Ajouter un client">
        <form onSubmit={handleCreate} noValidate>
          <FormField label="Prénom">
            <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
          </FormField>
          <FormField label="Nom">
            <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
          </FormField>
          <FormField label="Email">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="prenom.nom@email.com" />
          </FormField>
          <FormField label="Téléphone">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="06 00 00 00 00" />
          </FormField>
          <FormField label="Statut">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">Actif</option>
              <option value="pause">Pause</option>
              <option value="terminated">Terminé</option>
              <option value="prospect">Prospect</option>
            </Select>
          </FormField>
          {createError && <Alert variant="danger">{createError}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Button type="submit">Créer un client</Button>
        </form>
      </Card>

      <Card title="Liste des clients">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
          <FormField label="Recherche client">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nom, email ou téléphone"
            />
          </FormField>
          <FormField label="Filtre statut">
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | ClientStatus)}>
              <option value="all">Tous</option>
              <option value="active">Actif</option>
              <option value="pause">Pause</option>
              <option value="terminated">Terminé</option>
              <option value="prospect">Prospect</option>
            </Select>
          </FormField>
        </div>

        {listError && <Alert variant="danger">{listError}</Alert>}
        {editError && <Alert variant="danger">{editError}</Alert>}

        {loading ? (
          <p>Chargement...</p>
        ) : clients.length === 0 ? (
          <EmptyState title="Aucun client" description="Créez votre premier client pour démarrer le suivi." />
        ) : filteredClients.length === 0 ? (
          <EmptyState title="Aucun résultat" description="Aucun client ne correspond à la recherche ou au filtre sélectionné." />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  {editingClientId === client.id ? (
                    <>
                      <td>
                        <div style={{ display: 'grid', gap: 8 }}>
                          <Input value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} required />
                          <Input value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} required />
                        </div>
                      </td>
                      <td>
                        <Input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                      </td>
                      <td>
                        <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                      </td>
                      <td>
                        <Select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                          <option value="active">Actif</option>
                          <option value="pause">Pause</option>
                          <option value="terminated">Terminé</option>
                          <option value="prospect">Prospect</option>
                        </Select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <Button type="button" onClick={() => saveEditing(client.id)}>
                            Enregistrer
                          </Button>
                          <Button type="button" variant="secondary" onClick={cancelEditing}>
                            Annuler
                          </Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <Link to={`/clients/${client.id}`}>
                          {client.firstName} {client.lastName}
                        </Link>
                      </td>
                      <td>{client.email || '-'}</td>
                      <td>{client.phone || '-'}</td>
                      <td>
                        <Badge variant={getStatusVariant(client.status)}>{getStatusLabel(client.status)}</Badge>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <Button type="button" variant="secondary" onClick={() => startEditing(client)}>
                            Modifier
                          </Button>
                          <Link to={`/clients/${client.id}`}>Détail</Link>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
