'use client';

// ============================================================
// KROK 3 — Formularz Kontaktowy
// ============================================================

import { useState } from 'react';
import { User, Mail, Phone, MessageSquare, ArrowRight } from 'lucide-react';
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
    {
      id: 'firstName',
      label: 'Imię',
      type: 'text',
      placeholder: 'np. Anna',
      icon: <User size={14} />,
      required: true,
    },
    {
      id: 'lastName',
      label: 'Nazwisko',
      type: 'text',
      placeholder: 'np. Kowalska',
      icon: <User size={14} />,
      required: true,
    },
    {
      id: 'email',
      label: 'Adres email',
      type: 'email',
      placeholder: 'anna@example.com',
      icon: <Mail size={14} />,
      required: true,
    },
    {
      id: 'phone',
      label: 'Numer telefonu',
      type: 'tel',
      placeholder: '+48 501 234 567',
      icon: <Phone size={14} />,
      required: true,
    },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div
        className="glass-card"
        style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          {fields.slice(0, 2).map(f => {
            const error = touched[f.id] ? getFieldError(errors, f.id) : undefined;
            return (
              <div key={f.id} className="form-group">
                <label className="form-label" htmlFor={`contact-${f.id}`}>
                  {f.label} {f.required && <span className="required">*</span>}
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                      pointerEvents: 'none',
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
                    style={{ paddingLeft: '2.25rem' }}
                    autoComplete={f.id}
                  />
                </div>
                {error && <span className="form-error">{error}</span>}
              </div>
            );
          })}
        </div>

        {fields.slice(2).map(f => {
          const error = touched[f.id] ? getFieldError(errors, f.id) : undefined;
          return (
            <div key={f.id} className="form-group">
              <label className="form-label" htmlFor={`contact-${f.id}`}>
                {f.label} {f.required && <span className="required">*</span>}
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    pointerEvents: 'none',
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
                  style={{ paddingLeft: '2.25rem' }}
                  autoComplete={f.id === 'phone' ? 'tel' : f.id}
                />
              </div>
              {error && <span className="form-error">{error}</span>}
            </div>
          );
        })}

        {/* Notes */}
        <div className="form-group">
          <label className="form-label" htmlFor="contact-notes">
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <MessageSquare size={14} /> Uwagi (opcjonalne)
            </span>
          </label>
          <textarea
            id="contact-notes"
            value={data.notes}
            onChange={e => handleChange('notes', e.target.value)}
            placeholder="np. wrażliwa skóra, preferencje dotyczące zabiegu..."
            className="form-input"
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            padding: 'var(--space-3)',
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-primary)',
          }}
        >
          🔒 Twoje dane są bezpieczne. Nie wymagamy rejestracji ani zakładania konta.
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          id="contact-submit"
          className="btn btn-primary btn-lg"
        >
          Dalej — Sprawdź podsumowanie
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}
