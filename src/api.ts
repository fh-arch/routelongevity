import type { AuthRole, AuthSession } from './components/AuthModal';

const API_BASE = import.meta.env.VITE_API_BASE || '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Request failed.');
  }

  return data;
}

export async function signup(input: {
  role: AuthRole;
  name: string;
  businessName?: string;
  email: string;
  password: string;
}) {
  return request<{ user: AuthSession }>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function signin(input: {
  email: string;
  password: string;
}) {
  return request<{ user: AuthSession }>('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function getCurrentUser() {
  return request<{ user: AuthSession }>('/api/auth/me');
}

export async function signout() {
  return request<{ ok: true }>('/api/auth/signout', { method: 'POST' });
}
