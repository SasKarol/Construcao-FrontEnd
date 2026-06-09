const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333';
const TOKEN_KEY = 'pomodoro:token';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthResponse = {
  user: AuthUser;
  token: string;
  expiresAt: string;
};

type ForgotPasswordResponse = {
  message: string;
  resetToken?: string;
  expiresAt?: string;
};

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options?.headers);

  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));

    if (response.status === 401) {
      clearAuthToken();
      window.dispatchEvent(new Event('auth:logout'));
    }

    throw new Error(
      (body as { message?: string }).message ?? `Erro ${response.status}`,
    );
  }

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => request<{ user: AuthUser }>('/auth/me'),

  logout: () => request<void>('/auth/logout', { method: 'POST' }),

  forgotPassword: (email: string) =>
    request<ForgotPasswordResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (data: { token: string; password: string }) =>
    request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export type ApiSettings = {
  id: number;
  workTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  updatedAt: string;
};

export const settingsApi = {
  get: () => request<ApiSettings>('/settings'),

  put: (data: Omit<ApiSettings, 'id' | 'updatedAt'>) =>
    request<ApiSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export type ApiTask = {
  id: string;
  name: string;
  duration: number;
  type: string;
  startDate: number;
  completeDate: number | null;
  interruptDate: number | null;
  createdAt: string;
};

export const tasksApi = {
  list: () => request<ApiTask[]>('/tasks'),

  create: (data: Omit<ApiTask, 'createdAt'>) =>
    request<ApiTask>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  complete: (id: string, completeDate: number) =>
    request<ApiTask>(`/tasks/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completeDate }),
    }),

  interrupt: (id: string, interruptDate: number) =>
    request<ApiTask>(`/tasks/${id}/interrupt`, {
      method: 'PATCH',
      body: JSON.stringify({ interruptDate }),
    }),

  deleteAll: () => request<void>('/tasks', { method: 'DELETE' }),
};
