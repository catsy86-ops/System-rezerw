'use client';

// ============================================================
// KROK 4 — Podsumowanie Rezerwacji (Elite UX)
// ============================================================

import { Loader2, Edit2, CheckCircle, Calendar, Clock, User, Scissors, Mail, Phone, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency, formatDateLong, formatDuration } from '@/lib/formatters';
import type { BookingFormData, Service } from '@/types';

interface BookingSummaryProps {
  form: BookingFormData;
  service: Service;
  onConfirm: () => void;
  onEdit: (step: number) => void;
  submitting: boolean;
}

export function BookingSummary({ form, service, onConfirm, onEdit, submitting }: BookingSummaryProps) {
  const sections = [
    {
      title: 'Usługa',
      step: 1,
      items: [
        { icon: <Scissors size={14} />, label: 'Nazwa', value: service.name, primary: true },
        { icon: <Clock size={14} />, label: 'Czas trwania', value: formatDuration(service.duration) },
        { icon: <CheckCircle size={14} />, label: 'Cena', value: formatCurrency(service.price), accent: true },
      ]
    },
    {
      title: 'Termin',
      step: 2,
      items: [
        { icon: <Calendar size={14} />, label: 'Data', value: formatDateLong(form.date) },
        { icon: <Clock size={14} />, label: 'Godzina', value: form.time },
      ]
    },
    {
      title: 'Dane klienta',
      step: 3,
      items: [
        { icon: <User size={14} />, label: 'Klient', value: `${form.firstName} ${form.lastName}` },
        { icon: <Mail size={14} />, label: 'E-mail', value: form.email },
        { icon: <Phone size={14} />, label: 'Telefon', value: form.phone },
        ...(form.notes ? [{ icon: <MessageSquare size={14} />, label: 'Uwagi', value: form.notes }] : []),
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', maxWidth: 640, margin: '0 auto', paddingBottom: '120px' }}>
      <div className="glass-card-premium" style={{ overflow: 'hidden', padding: 0 }}>
        {/* Elite Header */}
        <div style={{ padding: '24px 32px', background: `linear-gradient(135deg, ${service.color}20, transparent)`, borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: '2.5rem' }}>{service.icon}</div>
          <div>
            <h3 style={{ fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>Podsumowanie wizyty</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nocny Promil</p>
          </div>
        </div>

        <div style={{ padding: 'var(--space-6) var(--space-8)' }}>
          {sections.map((section, idx) => (
            <div key={section.title} style={{ 
              marginBottom: idx === sections.length - 1 ? 0 : 'var(--space-8)',
              paddingBottom: idx === sections.length - 1 ? 0 : 'var(--space-8)',
              borderBottom: idx === sections.length - 1 ? 'none' : '1px solid var(--border-primary)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-primary)' }}>{section.title}</h4>
                <button 
                  onClick={() => onEdit(section.step)}
                  className="btn btn-ghost btn-sm"
                  style={{ height: 28, fontSize: '10px', fontWeight: 700, gap: 4, opacity: 0.7 }}
                >
                  <Edit2 size={10} /> Edytuj
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {section.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                      <span style={{ opacity: 0.6 }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <span style={{ 
                      fontSize: 'var(--text-sm)', 
                      fontWeight: (item as any).primary || (item as any).accent ? 800 : 600,
                      color: (item as any).accent ? 'var(--accent-primary)' : 'var(--text-primary)',
                      textAlign: 'right',
                      maxWidth: '60%'
                    }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Final Price Footer (Desktop) */}
        <div className="hidden-mobile" style={{ background: 'rgba(255,255,255,0.02)', padding: '24px 32px', borderTop: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>Całkowity koszt</span>
          <span style={{ fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--accent-primary)' }}>{formatCurrency(service.price)}</span>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        background: 'rgba(10, 15, 26, 0.8)', 
        backdropFilter: 'blur(20px)', 
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-primary)',
        padding: 'var(--space-4) var(--space-6) calc(var(--space-4) + env(safe-area-inset-bottom, 0px))',
        zIndex: 100,
        boxShadow: '0 -10px 40px rgba(0,0,0,0.5)'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          <div className="hidden-mobile" style={{ flex: 1 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', marginBottom: 2 }}>Razem do zapłaty</div>
            <div style={{ color: 'var(--accent-primary)', fontSize: 'var(--text-xl)', fontWeight: 900 }}>{formatCurrency(service.price)}</div>
          </div>
          
          <button
            id="confirm-booking"
            onClick={onConfirm}
            disabled={submitting}
            className="btn btn-primary glow-primary"
            style={{ 
              flex: 2, 
              padding: '16px', 
              borderRadius: 'var(--radius-xl)', 
              fontSize: 'var(--text-base)', 
              fontWeight: 800,
              boxShadow: '0 8px 32px var(--accent-primary-glow)'
            }}
          >
            {submitting ? (
              <>
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', marginRight: 10 }} />
                Przetwarzanie...
              </>
            ) : (
              <>
                <CheckCircle size={20} style={{ marginRight: 10 }} />
                Potwierdzam rezerwację
              </>
            )}
          </button>
        </div>
      </div>

      <p className="hidden-mobile" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)', opacity: 0.6 }}>
        Nocny Promil — Dziękujemy za zaufanie!
      </p>

      <style jsx>{`
        @media (max-width: 480px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
