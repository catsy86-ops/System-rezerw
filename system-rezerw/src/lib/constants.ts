// ============================================================
// STAŁE APLIKACJI
// ============================================================

export const APP_NAME = 'Nocny Promil';
export const APP_DESCRIPTION = 'Nocny Promil - całodobowy dowóz alkoholu';

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
  wódka: 'Wódka',
  piwo: 'Piwo',
  wino: 'Wino',
  whisky: 'Whisky',
  przekąski: 'Przekąski',
  inne: 'Inne',
};

export const CATEGORY_ICONS: Record<string, string> = {
  wódka: '🧊',
  piwo: '🍺',
  wino: '🍷',
  whisky: '🥃',
  przekąski: '🥨',
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
  { id: 1, label: 'Asortyment' },
  { id: 2, label: 'Czas dostawy' },
  { id: 3, label: 'Adres i Dane' },
  { id: 4, label: 'Podsumowanie' },
];

export const NAV_ITEMS = [
  { href: '/panel', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/panel/rezerwacje', label: 'Zamówienia', icon: 'Calendar' },
  { href: '/panel/uslugi', label: 'Asortyment', icon: 'Package' },
  { href: '/panel/klienci', label: 'Klienci', icon: 'Users' },
  { href: '/panel/ustawienia', label: 'Ustawienia', icon: 'Settings' },
];
