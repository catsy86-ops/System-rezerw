'use client';

// ============================================================
// KROK 3 — Formularz Kontaktowy (Elite Design)
// ============================================================

import { useState } from 'react';
import { User, Mail, Phone, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { validateBookingContact, getFieldError } from '@/lib/validators';
import type { ValidationError } from '@/lib/validators';

interface ContactFormProps {
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notes: string;
  };
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notes: string;
  }) => void;
}

export function ContactForm({ initialData, onSubmit }: ContactFormProps) {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      const result = validateBookingContact({ ...data, [field]: value });
      setErrors(result.errors);
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const result = validateBookingContact(data);
    setErrors(result.errors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, email: true, phone: true });
    const result = validateBookingContact(data);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    onSubmit(data);
  };

  const fields = [
    { id: 'firstName', label: 'Imię', type: 'text', placeholder: 'np. Anna', icon: <User size={16} />, required: true },
    { id: 'lastName', label: 'Nazwisko', type: 'text', placeholder: 'np. Kowalska', icon: <User size={16} />, required: true },
    { id: 'email', label: 'Adres e-mail', type: 'email', placeholder: 'anna@example.com', icon: <Mail size={16} />, required: true },
    { id: 'phone', label: 'Numer telefonu', type: 'tel', placeholder: '+48 500 000 000', icon: <Phone size={16} />, required: true },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 640, margin: '0 auto' }}>
      <div
        className="glass-card-premium"
        style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }} className="form-grid">
          {fields.map(f => {
            const error = touched[f.id] ? getFieldError(errors, f.id) : undefined;
            const isHalf = f.id === 'firstName' || f.id === 'lastName';
            
            return (
              <div key={f.id} className="form-group" style={{ gridColumn: isHalf ? 'auto' : 'span 2' }}>
                <label className="form-label" htmlFor={`contact-${f.id}`} style={{ fontWeight: 700, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {f.label} {f.required && <span className="required">*</span>}
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: error ? 'var(--status-danger)' : 'var(--text-muted)',
                      pointerEvents: 'none',
                      transition: 'color 0.2s ease'
                    }}
                  >
                    {f.icon}
                  </span>
                  <input
                    id={`contact-${f.id}`}
                    type={f.type}
                    value={(data as Record<string, string>)[f.id]}
                    onChange={e => handleChange(f.id, e.target.value)}
                    onBlur={() => handleBlur(f.id)}
                    placeholder={f.placeholder}
                    className={`form-input ${error ? 'error' : ''}`}
                    style={{ 
                      paddingLeft: '2.75rem', 
                      height: '52px', 
                      background: 'var(--bg-elevated)', 
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600
                    }}
                    autoComplete={f.id === 'phone' ? 'tel' : f.id}
                  />
                </div>
                <AnimatePresence>
                  {error && (
                    <motion.span 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="form-error"
                      style={{ marginTop: 4, fontWeight: 600 }}
                    >
                      {error}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label" htmlFor="contact-notes" style={{ fontWeight: 700, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <MessageSquare size={14} /> Uwagi do wizyty (opcjonalne)
            </span>
          </label>
          <textarea
            id="contact-notes"
            value={data.notes}
            onChange={e => handleChange('notes', e.target.value)}
            placeholder="np. domofon nie działa, proszę dzwonić, zostawić pod drzwiami..."
            className="form-input"
            rows={4}
            style={{ resize: 'vertical', background: 'var(--bg-elevated)', padding: 'var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 500 }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            padding: 'var(--space-4)',
            background: 'rgba(16, 185, 129, 0.03)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(16, 185, 129, 0.1)',
          }}
        >
          <ShieldCheck size={20} className="text-accent" style={{ flexShrink: 0 }} />
          <p style={{ lineHeight: 1.5 }}>Twoje dane są u nas bezpieczne. Wykorzystamy je wyłącznie w celu realizacji i potwierdzenia zamówienia przez <strong>Nocny Promil</strong>.</p>
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-10)', display: 'flex', justifyContent: 'center' }}>
        <button
          type="submit"
          id="contact-submit"
          className="btn btn-primary btn-lg glow-primary"
          style={{ width: '100%', maxWidth: 400, borderRadius: 'var(--radius-full)', padding: '18px', fontSize: 'var(--text-base)' }}
        >
          Sprawdź podsumowanie
          <ArrowRight size={20} style={{ marginLeft: 10 }} />
        </button>
      </div>

      <style jsx>{`
        @media (max-width: 500px) {
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  );
}
