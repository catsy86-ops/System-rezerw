'use client';

// ============================================================
// KROK 5 — Potwierdzenie Rezerwacji (Elite Design)
// ============================================================

import { CheckCircle, Calendar, Clock, User, Mail, Phone, Home, RotateCcw, Download, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
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
        maxWidth: 600,
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      {/* Success Celebration Icon */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: 'var(--space-8)' }}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          style={{
            width: 100,
            height: 100,
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-dark))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 40px var(--accent-primary-glow), 0 0 0 10px rgba(16, 185, 129, 0.05)',
            zIndex: 2,
            position: 'relative'
          }}
        >
          <CheckCircle size={48} color="#fff" strokeWidth={3} />
        </motion.div>
        
        {/* Animated Rings */}
        <motion.div 
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0, border: '2px solid var(--accent-primary)', borderRadius: '50%', zIndex: 1 }}
        />
        <motion.div 
          animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0, border: '1px solid var(--accent-primary)', borderRadius: '50%', zIndex: 1 }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-ls-tight" style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, marginBottom: 'var(--space-3)' }}>
          Wizyta zarezerwowana! 🎉
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-8)', lineHeight: 1.6 }}>
          Dziękujemy za wybór <strong>Nocny Promil</strong>. Twój termin został pomyślnie zarejestrowany w naszym systemie.
        </p>
      </motion.div>

      {/* Confirmation ID Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-full)',
          padding: '8px 20px',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
          marginBottom: 'var(--space-10)',
          fontWeight: 700,
          letterSpacing: '0.05em'
        }}
      >
        ID REZERWACJI: <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: 'var(--text-sm)' }}>{reservationId}</span>
      </motion.div>

      {/* Detailed Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card-premium"
        style={{ textAlign: 'left', marginBottom: 'var(--space-10)', overflow: 'hidden' }}
      >
        <div style={{ padding: '24px 32px', background: `linear-gradient(135deg, ${service.color}15, transparent)`, borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: '2.2rem' }}>{service.icon}</div>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{service.name}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: service.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Wizyta potwierdzona
            </div>
          </div>
        </div>

        <div style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="confirm-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                  <Calendar size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Data</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{formatDateLong(form.date)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                  <Clock size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Godzina</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{form.time} ({formatDuration(service.duration)})</div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                  <User size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Klient</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{form.firstName} {form.lastName}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                  <Mail size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Powiadomienie</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{form.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action inside card */}
        <div style={{ padding: '20px 32px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 500 }}>Chcesz mieć potwierdzenie przy sobie?</span>
          <button className="btn btn-ghost btn-sm" style={{ fontWeight: 700, color: 'var(--accent-primary)', gap: 8 }}>
            <Download size={14} /> Pobierz PDF
          </button>
        </div>
      </motion.div>

      {/* Simulated notifications */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          background: 'rgba(16, 185, 129, 0.05)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          marginBottom: 'var(--space-12)',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16
        }}
      >
        <Sparkles size={24} className="text-accent" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 'var(--text-sm)', marginBottom: 4 }}>Co dalej?</div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Wysłaliśmy właśnie e-mail z potwierdzeniem na adres <strong>{form.email}</strong>. 
            Przypomnienie SMS otrzymasz na 24h przed planowaną wizytą. Do zobaczenia w <strong>Nocny Promil</strong>!
          </p>
        </div>
      </motion.div>

      {/* Primary Actions */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/" className="btn btn-secondary btn-lg" style={{ borderRadius: 'var(--radius-full)', padding: '16px 32px', minWidth: 200, fontWeight: 700 }}>
          <Home size={18} style={{ marginRight: 8 }} />
          Strona główna
        </Link>
        <button className="btn btn-primary btn-lg glow-primary" onClick={onReset} style={{ borderRadius: 'var(--radius-full)', padding: '16px 32px', minWidth: 200, fontWeight: 800 }}>
          <RotateCcw size={18} style={{ marginRight: 8 }} />
          Nowa rezerwacja
        </button>
      </div>

      <style jsx>{`
        @media (max-width: 500px) {
          .confirm-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
      `}</style>
    </div>
  );
}
