// ============================================================
// SYSTEM REZERW — Globalne typy TypeScript
// ============================================================

export type ReservationStatus = 'oczekujaca' | 'potwierdzona' | 'zakonczona' | 'anulowana';
export type ServiceCategory = 'fryzjerstwo' | 'kosmetyka' | 'masaz' | 'paznokcie' | 'inne';

// ── Usługa ──────────────────────────────────────────────────
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;        // minuty
  price: number;           // PLN
  category: ServiceCategory;
  icon: string;            // emoji
  active: boolean;
  color: string;           // CSS color accent
}

// ── Klient ──────────────────────────────────────────────────
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
  createdAt: string;       // ISO date string
  totalBookings: number;
  totalSpent: number;
}

// ── Rezerwacja ───────────────────────────────────────────────
export interface Reservation {
  id: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  clientId: string;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;            // YYYY-MM-DD
  time: string;            // HH:MM
  status: ReservationStatus;
  notes?: string;
  createdAt: string;       // ISO date string
  updatedAt: string;       // ISO date string
}

// ── Ustawienia ───────────────────────────────────────────────
export interface BusinessSettings {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  openTime: string;        // HH:MM
  closeTime: string;       // HH:MM
  slotInterval: number;    // minuty (15, 30, 60)
  bufferTime: number;      // minuty przerwy między wizytami
  workingDays: number[];   // 0=niedziela, 1=poniedzialek, ... 6=sobota
  workingHoursExceptions?: {
    date: string;          // YYYY-MM-DD
    isOpen: boolean;
    openTime?: string;
    closeTime?: string;
  }[];
  currency: string;
  timezone: string;
}

// ── API ──────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  total?: number;
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}

// ── Dashboard ─────────────────────────────────────────────────
export interface DashboardStats {
  todayBookings: number;
  weekBookings: number;
  monthRevenue: number;
  newClients: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  recentReservations: Reservation[];
  popularServices: { service: Service; count: number }[];
  revenueByDay: { date: string; revenue: number }[];
}

// ── Formularze ────────────────────────────────────────────────
export interface BookingFormData {
  serviceId: string;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface ServiceFormData {
  name: string;
  description: string;
  duration: number;
  price: number;
  category: ServiceCategory;
  icon: string;
  color: string;
  active: boolean;
}

// ── Filtry ────────────────────────────────────────────────────
export interface ReservationFilters {
  status?: ReservationStatus | 'wszystkie';
  dateFrom?: string;
  dateTo?: string;
  serviceId?: string;
  search?: string;
}

// ── Toast ─────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}
