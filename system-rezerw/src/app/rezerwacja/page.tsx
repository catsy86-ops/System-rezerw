'use client';

// ============================================================
// STRONA REZERWACJI — Wielokrokowy formularz (Elite UX)
// ============================================================

import { useState, useCallback } from 'react';
import { CheckCircle, ArrowLeft, Calendar, User, List, Target, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServicePicker } from '@/components/booking/ServicePicker';
import { DateTimePicker } from '@/components/booking/DateTimePicker';
import { ContactForm } from '@/components/booking/ContactForm';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { BookingConfirmation } from '@/components/booking/BookingConfirmation';
import { useToast } from '@/components/ui/ToastProvider';
import { reservationsApi } from '@/lib/api';
import type { BookingFormData, Service } from '@/types';
import Link from 'next/link';

const STEPS = [
  { id: 1, label: 'Usługa', Icon: List },
  { id: 2, label: 'Termin', Icon: Calendar },
  { id: 3, label: 'Dane', Icon: User },
  { id: 4, label: 'Potwierdzenie', Icon: CheckCircle },
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    updateForm({ date, time });
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const res = await reservationsApi.create(form);
      setReservationId((res as unknown as { id: string }).id);
      toast.success(
        'Rezerwacja złożona!',
        `Potwierdzenie zostało zarejestrowane dla ${form.email}`
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', overflowX: 'hidden' }}>
      {/* Dynamic Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ 
          position: 'absolute', 
          top: '-10%', 
          right: '-10%', 
          width: '50vw', 
          height: '50vw', 
          background: 'radial-gradient(circle, var(--accent-primary-glow) 0%, transparent 70%)',
          opacity: 0.3,
          filter: 'blur(100px)'
        }} />
        <div style={{ 
          position: 'absolute', 
          bottom: '-10%', 
          left: '-10%', 
          width: '40vw', 
          height: '40vw', 
          background: 'radial-gradient(circle, var(--accent-secondary-glow) 0%, transparent 70%)',
          opacity: 0.2,
          filter: 'blur(80px)'
        }} />
      </div>

      {/* Header */}
      <header
        style={{
          background: 'rgba(10,15,26,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
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
              width: 34,
              height: 34,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16,185,129,0.2)',
            }}
          >
            <Target size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 900, fontSize: 'var(--text-base)', color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
            uFisza
          </span>
        </Link>
        
        {step < 5 && step > 1 ? (
          <button className="btn btn-ghost btn-sm" onClick={handleBack} style={{ fontWeight: 600 }}>
            <ArrowLeft size={16} style={{ marginRight: 6 }} />
            Wstecz
          </button>
        ) : (
          <Link href="/" className="btn btn-ghost btn-sm" style={{ color: 'var(--text-muted)' }}>
            Anuluj
          </Link>
        )}
      </header>

      <div
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: 'var(--space-12) var(--space-4) var(--space-20)',
          position: 'relative',
          zIndex: 1
        }}
      >
        {step < 5 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 'var(--space-12)' }}
          >
            {/* Stepper */}
            <div className="stepper" style={{ marginBottom: 'var(--space-10)', justifyContent: 'center' }}>
              {STEPS.map((s, i) => {
                const isCompleted = step > s.id;
                const isActive = step === s.id;
                
                return (
                  <div key={s.id} className="step" style={{ flex: i === STEPS.length - 1 ? '0 0 auto' : '1' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <motion.div
                        animate={isActive ? { scale: 1.1, boxShadow: '0 0 20px var(--accent-primary-glow)' } : { scale: 1 }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: isCompleted ? 'var(--accent-primary)' : isActive ? 'var(--bg-card)' : 'var(--bg-elevated)',
                          border: `2px solid ${isCompleted || isActive ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isCompleted ? '#fff' : isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                          fontWeight: 800,
                          fontSize: 'var(--text-sm)',
                          zIndex: 2,
                          transition: 'all 0.4s ease'
                        }}
                      >
                        {isCompleted ? <CheckCircle size={20} strokeWidth={3} /> : s.id}
                      </motion.div>

                      {i < STEPS.length - 1 && (
                        <div style={{ flex: 1, height: 2, background: 'var(--border-primary)', margin: '0 8px', position: 'relative', overflow: 'hidden' }}>
                          <motion.div 
                            initial={{ width: '0%' }}
                            animate={{ width: isCompleted ? '100%' : '0%' }}
                            transition={{ duration: 0.5 }}
                            style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'var(--accent-primary)' }}
                          />
                        </div>
                      )}
                    </div>
                    <div style={{ 
                      marginTop: 8, 
                      fontSize: '10px', 
                      fontWeight: 700, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em',
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                      textAlign: 'left',
                      marginLeft: 4,
                      display: 'none' // Hidden by default, shown via media query if needed
                    }} className="step-label-mobile">
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Title & Header */}
            <div style={{ textAlign: 'center' }}>
              <motion.div
                key={step + '-title'}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="badge" style={{ background: 'var(--accent-primary-glow)', color: 'var(--accent-primary)', marginBottom: 12, borderRadius: 'var(--radius-full)', padding: '4px 12px', fontWeight: 600 }}>
                  Krok {step} z 4
                </div>
                <h1 className="text-ls-tight" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 900, marginBottom: 'var(--space-2)' }}>
                  {step === 1 && 'Co dziś dla Ciebie zrobimy?'}
                  {step === 2 && 'Wybierz idealny moment'}
                  {step === 3 && 'Ostatnie szczegóły'}
                  {step === 4 && 'Sprawdź i potwierdź'}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', maxWidth: 480, margin: '0 auto' }}>
                  {step === 1 && 'Wybierz jedną z naszych luksusowych usług fryzjerskich.'}
                  {step === 2 && 'Nasz kalendarz jest zawsze aktualny. Wybierz termin, który Ci pasuje.'}
                  {step === 3 && 'Wypełnij dane, abyśmy mogli wysłać Ci potwierdzenie wizyty.'}
                  {step === 4 && 'Prawie gotowe! Upewnij się, że wszystko się zgadza.'}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step Content */}
        <div style={{ position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(8px)' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
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
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 480px) {
          .step-label-mobile { display: block !important; }
        }
      `}</style>
    </div>
  );
}
