const baseUrl = import.meta.env.DEV ? '/api' : '/api';

async function request(path: string, options: RequestInit = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    const json = await response.json().catch(() => null);
    throw new Error(json?.error || response.statusText);
  }
  return response.json();
}

export const api = {
  login: (email: string, password: string) => request('/auth/login', { method: 'POST', body: { email, password } }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
  dashboard: () => request('/dashboard'),
  clients: {
    list: () => request('/clients'),
    get: (id: string) => request(`/clients/${id}`),
    create: (data: any) => request('/clients', { method: 'POST', body: data }),
    update: (id: string, data: any) => request(`/clients/${id}`, { method: 'PUT', body: data }),
    notes: {
      list: (id: string) => request(`/clients/${id}/notes`),
      add: (id: string, content: string) => request(`/clients/${id}/notes`, { method: 'POST', body: { content } })
    }
  },
  programs: {
    list: () => request('/programs'),
    create: (data: any) => request('/programs', { method: 'POST', body: data })
  },
  exercises: {
    list: () => request('/exercises'),
    create: (data: any) => request('/exercises', { method: 'POST', body: data })
  },
  settings: {
    get: () => request('/settings'),
    update: (data: any) => request('/settings', { method: 'PUT', body: data })
  }
};
