'use client';

// ============================================================
// STRONA ANULOWANIA REZERWACJI PRZEZ KLIENTA
// ============================================================

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, Mail, Scissors, DollarSign, Trash2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { reservationsApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { useToast } from '@/components/ui/ToastProvider';
import type { Reservation } from '@/types';

export default function CancelBookingPage() {
  const [bookingId, setBookingId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [cancelled, setCancelled] = useState(false);

  const toast = useToast();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId.trim() || !email.trim()) {
      toast.error('Błąd walidacji', 'Wpisz numer rezerwacji oraz adres e-mail.');
      return;
    }

    setLoading(true);
    try {
      const res = await reservationsApi.getById(bookingId.trim(), email.trim());
      if (res.status === 'anulowana') {
        toast.warning('Już anulowana', 'Ta rezerwacja została już wcześniej anulowana.');
      }
      setReservation(res);
    } catch (err: any) {
      toast.error('Błąd weryfikacji', err.message || 'Nie znaleziono rezerwacji pasującej do podanych danych.');
      setReservation(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!reservation) return;
    setLoading(true);
    try {
      await reservationsApi.delete(reservation.id);
      setCancelled(true);
      toast.success('Anulowano wizytę', 'Twoja rezerwacja została pomyślnie anulowana.');
    } catch (err: any) {
      toast.error('Błąd anulowania', err.message || 'Nie udało się anulować wizyty. Spróbuj ponownie później.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-6)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'var(--accent-primary-glow)',
        borderRadius: '50%',
        filter: 'blur(120px)',
        top: '-10%',
        left: '-10%',
        zIndex: -1,
        opacity: 0.5,
      }} />
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'var(--accent-secondary-glow)',
        borderRadius: '50%',
        filter: 'blur(120px)',
        bottom: '-10%',
        right: '-10%',
        zIndex: -1,
        opacity: 0.5,
      }} />

      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '520px',
        padding: 'var(--space-8)',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}>
        {/* Navigation back */}
        <div>
          <Link href="/" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', paddingLeft: 0 }}>
            <ArrowLeft size={16} /> Wróć do strony głównej
          </Link>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center' }}>
          <h1 className="text-gradient" style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
            Zarządzaj rezerwacją
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Możesz w tym miejscu bezpłatnie anulować zaplanowaną wizytę.
          </p>
        </div>

        <div className="divider" style={{ margin: 0 }} />

        {cancelled ? (
          // Success State
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 'var(--space-4)',
            padding: 'var(--space-4) 0',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--status-success-bg)',
              border: '1px solid var(--status-success-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--status-success)',
              marginBottom: 'var(--space-2)',
            }}>
              <CheckCircle2 size={32} />
            </div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>Wizyta została anulowana</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: '1.6' }}>
              Rezerwacja o numerze <strong style={{ color: 'var(--text-primary)' }}>{reservation?.id}</strong> została pomyślnie anulowana w naszym systemie. Potwierdzenie zostało zarejestrowane.
            </p>
            <Link href="/" className="btn btn-primary" style={{ marginTop: 'var(--space-4)', width: '100%' }}>
              Wróć do strony głównej
            </Link>
          </div>
        ) : reservation ? (
          // Reservation details + Confirmation
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={14} style={{ color: 'var(--status-warning)' }} />
                Szczegóły rezerwacji:
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Usługa:</span>
                  <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Scissors size={14} /> {reservation.serviceName}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Data wizyty:</span>
                  <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={14} /> {formatDate(reservation.date)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Godzina:</span>
                  <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={14} /> {reservation.time} ({reservation.serviceDuration} min)
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Klient:</span>
                  <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <User size={14} /> {reservation.clientFirstName} {reservation.clientLastName}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Cena:</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <DollarSign size={14} /> {formatCurrency(reservation.servicePrice)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Status rezerwacji:</span>
                  <span style={{ textTransform: 'capitalize' }}>
                    <span className={`badge badge-${
                      reservation.status === 'potwierdzona' ? 'success' :
                      reservation.status === 'zakonczona' ? 'info' :
                      reservation.status === 'anulowana' ? 'danger' : 'warning'
                    }`}>
                      {reservation.status === 'oczekujaca' ? 'Oczekująca' : reservation.status}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {reservation.status === 'anulowana' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4)',
                  color: 'var(--status-danger)',
                  fontSize: 'var(--text-sm)',
                  textAlign: 'center',
                }}>
                  Ta wizyta została już anulowana.
                </div>
                <button
                  type="button"
                  onClick={() => setReservation(null)}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  Weryfikuj inną rezerwację
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button
                  type="button"
                  onClick={() => setReservation(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  disabled={loading}
                >
                  Wróć
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-danger"
                  style={{ flex: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  disabled={loading}
                >
                  <Trash2 size={16} /> {loading ? 'Anulowanie...' : 'Anuluj wizytę'}
                </button>
              </div>
            )}
          </div>
        ) : (
          // Form State
          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label htmlFor="booking-id" className="form-label">
                Numer rezerwacji <span className="required">*</span>
              </label>
              <input
                id="booking-id"
                type="text"
                placeholder="np. res-1234abcd"
                value={bookingId}
                onChange={e => setBookingId(e.target.value)}
                className="form-input"
                required
                disabled={loading}
              />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                Numer znajdziesz w potwierdzeniu rezerwacji.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="booking-email" className="form-label">
                Adres e-mail <span className="required">*</span>
              </label>
              <input
                id="booking-email"
                type="email"
                placeholder="np. jan.kowalski@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-input"
                required
                disabled={loading}
              />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                E-mail podany w trakcie rezerwacji wizyty.
              </span>
            </div>

            <button
              id="submit-verify"
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 'var(--space-2)' }}
              disabled={loading}
            >
              {loading ? 'Weryfikacja...' : 'Zweryfikuj rezerwację'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
