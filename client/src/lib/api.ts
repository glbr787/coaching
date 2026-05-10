const baseUrl = import.meta.env.DEV ? '/api' : '/api';

function toCamelCase(input: string) {
  return input.replace(/_([a-z])/g, (_, group: string) => group.toUpperCase());
}

function normalizeKeys<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeKeys(item)) as T;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).map(([key, val]) => [
      toCamelCase(key),
      normalizeKeys(val)
    ]);
    return Object.fromEntries(entries) as T;
  }
  return value;
}

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
  const json = await response.json();
  return normalizeKeys(json);
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
