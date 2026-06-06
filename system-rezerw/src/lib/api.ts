// ============================================================
// API CLIENT — Fetch wrapper dla klienta
// ============================================================

import type { ApiResponse, ApiError } from '@/types';

class ApiError_ extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  const json = await res.json();

  if (!res.ok) {
    const errData = json as ApiError;
    throw new ApiError_(res.status, errData.error || 'Błąd serwera', errData.details);
  }

  return (json as ApiResponse<T>).data;
}

// ── Rezerwacje ────────────────────────────────────────────────
export const reservationsApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<import('@/types').Reservation[]>(`/api/rezerwacje${qs}`);
  },
  getById: (id: string, email: string) =>
    request<import('@/types').Reservation>(`/api/rezerwacje/${id}?email=${encodeURIComponent(email)}`),
  create: (data: import('@/types').BookingFormData) =>
    request<import('@/types').Reservation>('/api/rezerwacje', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<import('@/types').Reservation>) =>
    request<import('@/types').Reservation>(`/api/rezerwacje/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<{ id: string }>(`/api/rezerwacje/${id}`, { method: 'DELETE' }),
};

// ── Usługi ────────────────────────────────────────────────────
export const servicesApi = {
  getAll: () => request<import('@/types').Service[]>('/api/uslugi'),
  create: (data: import('@/types').ServiceFormData) =>
    request<import('@/types').Service>('/api/uslugi', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<import('@/types').ServiceFormData>) =>
    request<import('@/types').Service>(`/api/uslugi/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<{ id: string }>(`/api/uslugi/${id}`, { method: 'DELETE' }),
};

// ── Klienci ───────────────────────────────────────────────────
export const clientsApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<import('@/types').Client[]>(`/api/klienci${qs}`);
  },
};

// ── Statystyki ────────────────────────────────────────────────
export const statsApi = {
  getDashboard: () => request<import('@/types').DashboardStats>('/api/statystyki'),
};
