'use client';

// ============================================================
// KROK 4 — Podsumowanie Rezerwacji
// ============================================================

import { Loader2, Edit2, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDateLong, formatDuration } from '@/lib/formatters';
import type { BookingFormData, Service } from '@/types';

interface BookingSummaryProps {
  form: BookingFormData;
  service: Service;
  onConfirm: () => void;
  onEdit: (step: number) => void;
  submitting: boolean;
}

interface SummaryRow {
  label: string;
  value: React.ReactNode;
  step?: number;
}

export function BookingSummary({ form, service, onConfirm, onEdit, submitting }: BookingSummaryProps) {
  const rows: SummaryRow[] = [
    {
      label: 'Usługa',
      value: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 600 }}>
          {service.icon} {service.name}
        </span>
      ),
      step: 1,
    },
    { label: 'Czas trwania', value: formatDuration(service.duration) },
    { label: 'Cena', value: <span style={{ color: service.color, fontWeight: 700 }}>{formatCurrency(service.price)}</span> },
    {
      label: 'Data',
      value: formatDateLong(form.date),
      step: 2,
    },
    { label: 'Godzina', value: form.time, step: 2 },
    {
      label: 'Imię i nazwisko',
      value: `${form.firstName} ${form.lastName}`,
      step: 3,
    },
    { label: 'Email', value: form.email, step: 3 },
    { label: 'Telefon', value: form.phone, step: 3 },
  ];

  if (form.notes) {
    rows.push({ label: 'Uwagi', value: form.notes });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Summary Card */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {/* Header */}
        <div
          style={{
            padding: 'var(--space-5)',
            background: `linear-gradient(135deg, ${service.color}15, transparent)`,
            borderBottom: '1px solid var(--border-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
          }}
        >
          <span style={{ fontSize: '2rem' }}>{service.icon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>{service.name}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Szczegóły Twojej rezerwacji</div>
          </div>
        </div>

        {/* Rows */}
        <div style={{ padding: 'var(--space-2)' }}>
          {rows.map(({ label, value, step }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                transition: 'background var(--transition-fast)',
              }}
            >
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', minWidth: 120 }}>
                {label}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', textAlign: 'right' }}>
                  {value}
                </span>
                {step && (
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => onEdit(step)}
                    aria-label={`Edytuj ${label}`}
                    style={{ opacity: 0.6 }}
                  >
                    <Edit2 size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info box */}
      <div
        style={{
          background: 'rgba(16,185,129,0.05)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-4)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}
      >
        ✅ Po potwierdzeniu rezerwacji wyślemy Ci powiadomienie na podany adres email i numer telefonu.
        Rezerwację możesz anulować bezpłatnie na 24 godziny przed wizytą.
      </div>

      {/* Confirm Button */}
      <button
        id="confirm-booking"
        onClick={onConfirm}
        disabled={submitting}
        className="btn btn-primary btn-lg w-full"
        style={{ justifyContent: 'center', fontSize: 'var(--text-base)' }}
      >
        {submitting ? (
          <>
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            Potwierdzanie...
          </>
        ) : (
          <>
            <CheckCircle size={20} />
            Potwierdź rezerwację
          </>
        )}
      </button>
    </div>
  );
}
