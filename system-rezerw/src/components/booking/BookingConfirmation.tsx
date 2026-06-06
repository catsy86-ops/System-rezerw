'use client';

// ============================================================
// KROK 5 — Potwierdzenie Rezerwacji
// ============================================================

import { CheckCircle, Calendar, Clock, User, Mail, Phone, Home, RotateCcw } from 'lucide-react';
import { formatCurrency, formatDateLong, formatDuration } from '@/lib/formatters';
import Link from 'next/link';
import type { BookingFormData, Service } from '@/types';

interface BookingConfirmationProps {
  reservationId: string;
  service: Service;
  form: BookingFormData;
  onReset: () => void;
}

export function BookingConfirmation({ reservationId, service, form, onReset }: BookingConfirmationProps) {
  return (
    <div
      style={{
        maxWidth: 520,
        margin: '0 auto',
        textAlign: 'center',
        animation: 'slideUp 400ms ease',
      }}
    >
      {/* Success Icon */}
      <div
        style={{
          width: 80,
          height: 80,
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-dark))',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-6)',
          boxShadow: '0 0 40px rgba(16,185,129,0.4), 0 0 0 12px rgba(16,185,129,0.1)',
          animation: 'float 3s ease-in-out infinite',
        }}
      >
        <CheckCircle size={36} color="#fff" />
      </div>

      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, marginBottom: 'var(--space-3)' }}>
        Rezerwacja złożona! 🎉
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
        Twoja wizyta została pomyślnie zarezerwowana.
      </p>
      <div
        style={{
          display: 'inline-block',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-full)',
          padding: 'var(--space-1) var(--space-4)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
          marginBottom: 'var(--space-8)',
          fontFamily: 'monospace',
        }}
      >
        ID: {reservationId}
      </div>

      {/* Details */}
      <div
        className="glass-card"
        style={{ textAlign: 'left', marginBottom: 'var(--space-6)', overflow: 'hidden' }}
      >
        {/* Service header */}
        <div
          style={{
            padding: 'var(--space-4) var(--space-5)',
            background: `linear-gradient(135deg, ${service.color}15, transparent)`,
            borderBottom: '1px solid var(--border-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
          }}
        >
          <span style={{ fontSize: '1.8rem' }}>{service.icon}</span>
          <div>
            <div style={{ fontWeight: 700 }}>{service.name}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: service.color, fontWeight: 600 }}>
              {formatCurrency(service.price)} · {formatDuration(service.duration)}
            </div>
          </div>
        </div>

        <div style={{ padding: 'var(--space-4)' }}>
          {[
            { icon: <Calendar size={14} />, label: formatDateLong(form.date) },
            { icon: <Clock size={14} />, label: `Godzina ${form.time}` },
            { icon: <User size={14} />, label: `${form.firstName} ${form.lastName}` },
            { icon: <Mail size={14} />, label: form.email },
            { icon: <Phone size={14} />, label: form.phone },
          ].map(({ icon, label }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-2) var(--space-2)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
              }}
            >
              <span style={{ color: 'var(--accent-primary)', flexShrink: 0 }}>{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Simulated notifications */}
      <div
        style={{
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          textAlign: 'left',
        }}
      >
        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
          📬 Powiadomienia wysłane (symulacja)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', fontSize: 'var(--text-xs)' }}>
          <div>✉️ Email potwierdzający → <strong>{form.email}</strong></div>
          <div>📱 SMS przypomnienie → <strong>{form.phone}</strong></div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/" className="btn btn-secondary">
          <Home size={16} />
          Strona główna
        </Link>
        <button className="btn btn-primary" onClick={onReset} id="new-booking-btn">
          <RotateCcw size={16} />
          Nowa rezerwacja
        </button>
      </div>
    </div>
  );
}
