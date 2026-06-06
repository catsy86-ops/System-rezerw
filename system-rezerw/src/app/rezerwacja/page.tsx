'use client';

// ============================================================
// STRONA REZERWACJI — Wielokrokowy formularz
// ============================================================

import { useState, useCallback } from 'react';
import { CheckCircle, ArrowLeft, Calendar, Clock, User, List } from 'lucide-react';
import { ServicePicker } from '@/components/booking/ServicePicker';
import { DateTimePicker } from '@/components/booking/DateTimePicker';
import { ContactForm } from '@/components/booking/ContactForm';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { BookingConfirmation } from '@/components/booking/BookingConfirmation';
import { useToast } from '@/components/ui/ToastProvider';
import { reservationsApi } from '@/lib/api';
import type { BookingFormData, Service } from '@/types';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Usługa', Icon: List },
  { id: 2, label: 'Termin', Icon: Calendar },
  { id: 3, label: 'Dane', Icon: User },
  { id: 4, label: 'Podsumowanie', Icon: CheckCircle },
];

const DEFAULT_FORM: BookingFormData = {
  serviceId: '',
  date: '',
  time: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  notes: '',
};

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<BookingFormData>(DEFAULT_FORM);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [reservationId, setReservationId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const updateForm = useCallback((updates: Partial<BookingFormData>) => {
    setForm(prev => ({ ...prev, ...updates }));
  }, []);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    updateForm({ serviceId: service.id, date: '', time: '' });
    setStep(2);
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    updateForm({ date, time });
    setStep(3);
  };

  const handleContactSubmit = (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notes: string;
  }) => {
    updateForm(data);
    setStep(4);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const res = await reservationsApi.create(form);
      setReservationId((res as unknown as { id: string }).id);
      // Simulate notification
      toast.success(
        'Rezerwacja złożona!',
        `Potwierdzenie zostało "wysłane" na ${form.email}`
      );
      setStep(5);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error('Błąd rezerwacji', error.message || 'Spróbuj ponownie później');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 5) setStep(prev => prev - 1);
  };

  const handleReset = () => {
    setForm(DEFAULT_FORM);
    setSelectedService(null);
    setReservationId('');
    setStep(1);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header
        style={{
          background: 'rgba(10,15,26,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-primary)',
          padding: 'var(--space-4) var(--space-8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Link href="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-dark))',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
            Salon Aurora
          </span>
        </Link>
        {step < 5 && step > 1 && (
          <button className="btn btn-ghost btn-sm" onClick={handleBack}>
            <ArrowLeft size={14} />
            Wstecz
          </button>
        )}
      </header>

      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: 'var(--space-8) var(--space-4)',
        }}
      >
        {step < 5 && (
          <>
            {/* Stepper */}
            <div className="stepper" style={{ marginBottom: 'var(--space-10)' }}>
              {STEPS.map((s, i) => (
                <div key={s.id} className="step" style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div
                    className={`step-circle ${step === s.id ? 'active' : step > s.id ? 'completed' : ''}`}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      border: '2px solid',
                      borderColor: step > s.id ? 'var(--accent-primary)' : step === s.id ? 'var(--accent-primary)' : 'var(--border-primary)',
                      background: step > s.id ? 'var(--accent-primary)' : step === s.id ? 'var(--accent-primary-glow)' : 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 'var(--text-sm)',
                      color: step > s.id ? '#fff' : step === s.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                      flexShrink: 0,
                      transition: 'all var(--transition-base)',
                      boxShadow: step === s.id ? '0 0 0 4px var(--accent-primary-glow)' : 'none',
                    }}
                  >
                    {step > s.id ? <CheckCircle size={16} /> : s.id}
                  </div>

                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 500,
                      marginLeft: 'var(--space-2)',
                      color: step >= s.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                    }}
                    className="hidden-mobile-text"
                  >
                    {s.label}
                  </span>

                  {i < STEPS.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: 2,
                        background: step > s.id ? 'var(--accent-primary)' : 'var(--border-primary)',
                        margin: '0 var(--space-2)',
                        transition: 'background var(--transition-slow)',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
                {step === 1 && 'Wybierz usługę'}
                {step === 2 && 'Wybierz termin'}
                {step === 3 && 'Twoje dane'}
                {step === 4 && 'Podsumowanie rezerwacji'}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                {step === 1 && 'Kliknij na usługę, która Cię interesuje'}
                {step === 2 && 'Wybierz preferowaną datę i godzinę'}
                {step === 3 && 'Uzupełnij dane kontaktowe — bez rejestracji'}
                {step === 4 && 'Sprawdź szczegóły i potwierdź rezerwację'}
              </p>
            </div>
          </>
        )}

        {/* Step Content */}
        <div className="page-enter">
          {step === 1 && (
            <ServicePicker onSelect={handleServiceSelect} selectedId={form.serviceId} />
          )}
          {step === 2 && selectedService && (
            <DateTimePicker
              service={selectedService}
              selectedDate={form.date}
              selectedTime={form.time}
              onSelect={handleDateTimeSelect}
            />
          )}
          {step === 3 && (
            <ContactForm
              initialData={{
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                notes: form.notes || '',
              }}
              onSubmit={handleContactSubmit}
            />
          )}
          {step === 4 && selectedService && (
            <BookingSummary
              form={form}
              service={selectedService}
              onConfirm={handleConfirm}
              onEdit={setStep}
              submitting={submitting}
            />
          )}
          {step === 5 && (
            <BookingConfirmation
              reservationId={reservationId}
              service={selectedService!}
              form={form}
              onReset={handleReset}
            />
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .hidden-mobile-text { display: none; }
        }
      `}</style>
    </div>
  );
}
