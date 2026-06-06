// ============================================================
// STAŁE APLIKACJI
// ============================================================

export const APP_NAME = 'uFisza';
export const APP_DESCRIPTION = 'Salon Fryzjerski uFisza - profesjonalne usługi fryzjerskie i stylizacja';

export const STATUS_LABELS: Record<string, string> = {
  oczekujaca: 'Oczekująca',
  potwierdzona: 'Potwierdzona',
  zakonczona: 'Zakończona',
  anulowana: 'Anulowana',
  wszystkie: 'Wszystkie',
};

export const STATUS_COLORS: Record<string, string> = {
  oczekujaca: 'warning',
  potwierdzona: 'success',
  zakonczona: 'info',
  anulowana: 'danger',
};

export const CATEGORY_LABELS: Record<string, string> = {
  fryzjerstwo: 'Fryzjerstwo',
  kosmetyka: 'Kosmetyka',
  masaz: 'Masaż',
  paznokcie: 'Paznokcie',
  inne: 'Inne',
};

export const CATEGORY_ICONS: Record<string, string> = {
  fryzjerstwo: '✂️',
  kosmetyka: '🌿',
  masaz: '🧘',
  paznokcie: '💅',
  inne: '⭐',
};

export const DAYS_PL = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
export const DAYS_SHORT_PL = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb'];
export const MONTHS_PL = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

export const SLOT_INTERVALS = [
  { value: 15, label: '15 minut' },
  { value: 30, label: '30 minut' },
  { value: 60, label: '60 minut' },
];

export const BOOKING_STEPS = [
  { id: 1, label: 'Usługa' },
  { id: 2, label: 'Termin' },
  { id: 3, label: 'Dane' },
  { id: 4, label: 'Podsumowanie' },
];

export const NAV_ITEMS = [
  { href: '/panel', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/panel/rezerwacje', label: 'Rezerwacje', icon: 'Calendar' },
  { href: '/panel/uslugi', label: 'Usługi', icon: 'Scissors' },
  { href: '/panel/klienci', label: 'Klienci', icon: 'Users' },
  { href: '/panel/ustawienia', label: 'Ustawienia', icon: 'Settings' },
];
