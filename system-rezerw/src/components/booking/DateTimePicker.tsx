'use client';

// ============================================================
// KROK 2 — Wybór Daty i Godziny (Elite Design)
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { reservationsApi } from '@/lib/api';
import {
  formatDateLong,
  formatDuration,
  getTodayString,
  isDateInPast,
  getDayOfWeek,
} from '@/lib/formatters';
import { DAYS_SHORT_PL, MONTHS_PL } from '@/lib/constants';
import { generateSlots, calculateTakenSlots } from '@/lib/bookingHelpers';
import { CalendarSkeleton } from '@/components/ui/Skeleton';
import type { Reservation, Service, BusinessSettings } from '@/types';

interface DateTimePickerProps {
  service: Service;
  selectedDate: string;
  selectedTime: string;
  onSelect: (date: string, time: string) => void;
}

export function DateTimePicker({ service, selectedDate, selectedTime, onSelect }: DateTimePickerProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [pickedDate, setPickedDate] = useState(selectedDate);
  const [pickedTime, setPickedTime] = useState(selectedTime);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    fetch('/api/ustawienia')
      .then(r => r.json())
      .then(d => {
        if (d.success) setSettings(d.data);
      });
  }, []);

  const fetchTakenSlots = useCallback(async (date: string, currentSettings: BusinessSettings) => {
    setLoadingSlots(true);
    try {
      const reservations = await reservationsApi.getAll({ dateFrom: date, dateTo: date });
      
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const isTodaySelected = date === getTodayString();

      const getEffectiveHoursForDate = (d: string) => {
        const exception = currentSettings.workingHoursExceptions?.find(e => e.date === d);
        if (exception && exception.isOpen) {
          return { open: exception.openTime || currentSettings.openTime, close: exception.closeTime || currentSettings.closeTime };
        }
        return { open: currentSettings.openTime, close: currentSettings.closeTime };
      };

      const eff = getEffectiveHoursForDate(date);
      const allSlots = generateSlots(eff.open, eff.close, currentSettings.slotInterval);

      const taken = calculateTakenSlots({
        date,
        reservations: reservations as unknown as Reservation[],
        serviceDuration: service.duration,
        allSlots,
        closeTime: eff.close,
        intervalMinutes: currentSettings.slotInterval,
        isToday: isTodaySelected,
        currentMinutes,
        bufferMinutes: currentSettings.bufferTime,
      });

      setTakenSlots(taken);
    } catch {
      setTakenSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [service.duration]);

  useEffect(() => {
    if (pickedDate && settings) fetchTakenSlots(pickedDate, settings);
  }, [pickedDate, settings, fetchTakenSlots]);

  if (!settings) {
    return <CalendarSkeleton />;
  }

  const WORKING_DAYS = settings.workingDays;

  // Calendar days logic
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const adjustedFirst = (firstDayOfMonth + 6) % 7; // Mon=0

  const calDays: (number | null)[] = [
    ...Array(adjustedFirst).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const makeDateStr = (day: number) => {
    const m = (viewMonth + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${viewYear}-${m}-${d}`;
  };

  const isDisabledDay = (day: number) => {
    const ds = makeDateStr(day);
    const exception = settings.workingHoursExceptions?.find(e => e.date === ds);
    if (exception) return isDateInPast(ds) || !exception.isOpen;
    return isDateInPast(ds) || !WORKING_DAYS.includes(getDayOfWeek(ds));
  };

  const handleDayClick = (day: number) => {
    const ds = makeDateStr(day);
    if (isDisabledDay(day)) return;
    setPickedDate(ds);
    setPickedTime('');
  };

  const handleTimeClick = (slot: string) => {
    if (takenSlots.includes(slot)) return;
    setPickedTime(slot);
    onSelect(pickedDate, slot);
  };

  const changeMonth = (offset: number) => {
    let newMonth = viewMonth + offset;
    let newYear = viewYear;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setViewMonth(newMonth);
    setViewYear(newYear);
  };

  const getEffectiveHours = (date: string) => {
    const exception = settings.workingHoursExceptions?.find(e => e.date === date);
    if (exception && exception.isOpen) {
      return { open: exception.openTime || settings.openTime, close: exception.closeTime || settings.closeTime };
    }
    return { open: settings.openTime, close: settings.closeTime };
  };

  const effectiveHours = pickedDate ? getEffectiveHours(pickedDate) : { open: settings.openTime, close: settings.closeTime };
  const ALL_SLOTS = generateSlots(effectiveHours.open, effectiveHours.close, settings.slotInterval);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Active Service Summary */}
      <div
        className="glass-card-premium"
        style={{
          padding: 'var(--space-4) var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          borderLeft: `4px solid ${service.color}`,
        }}
      >
        <div style={{ fontSize: '2rem' }}>{service.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>{service.name}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'flex', gap: 'var(--space-4)', marginTop: 2, fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} /> {formatDuration(service.duration)}
            </span>
            <span style={{ color: service.color }}>
              {formatCurrency(service.price)}
            </span>
          </div>
        </div>
        <div className="badge badge-success" style={{ borderRadius: 'var(--radius-full)', padding: '4px 10px' }}>
          Wybrano
        </div>
      </div>

      <div className="date-time-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-8)' }}>
        {/* Calendar Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)' }}>
            <CalendarIcon size={18} className="text-accent" />
            <h3 style={{ fontWeight: 800, fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Wybierz datę wizyty
            </h3>
          </div>

          <div className="glass-card" style={{ border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-primary)', background: 'rgba(255,255,255,0.02)' }}>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => changeMonth(-1)} aria-label="Poprzedni miesiąc">
                <ChevronLeft size={18} />
              </button>
              <span style={{ fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                {MONTHS_PL[viewMonth]} {viewYear}
              </span>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => changeMonth(1)} aria-label="Następny miesiąc">
                <ChevronRight size={18} />
              </button>
            </div>

            <div style={{ padding: 'var(--space-4)' }}>
              {/* Day headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 8 }}>
                {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{d}</div>
                ))}
              </div>

              {/* Days Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {calDays.map((day, i) => {
                  if (day === null) return <div key={`empty-${i}`} />;
                  
                  const ds = makeDateStr(day);
                  const isToday = ds === getTodayString();
                  const disabled = isDisabledDay(day);
                  const isSelected = ds === pickedDate;

                  return (
                    <motion.button
                      key={day}
                      whileTap={!disabled ? { scale: 0.92 } : {}}
                      onClick={() => handleDayClick(day)}
                      disabled={disabled}
                      style={{
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'var(--text-sm)',
                        fontWeight: isSelected || isToday ? 800 : 500,
                        borderRadius: 'var(--radius-lg)',
                        border: 'none',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        background: isSelected ? 'var(--accent-primary)' : 'transparent',
                        color: isSelected ? '#fff' : disabled ? 'var(--text-muted)' : 'var(--text-primary)',
                        position: 'relative',
                        opacity: disabled ? 0.3 : 1,
                        transition: 'background 0.2s ease, color 0.2s ease'
                      }}
                    >
                      {day}
                      {isToday && !isSelected && (
                        <div style={{ position: 'absolute', bottom: 6, width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Time Slots Section */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)' }}>
            <Clock size={18} className="text-accent" />
            <h3 style={{ fontWeight: 800, fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Wybierz godzinę
            </h3>
          </div>

          <AnimatePresence mode="wait">
            {!pickedDate ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  height: '100%',
                  minHeight: 200,
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px dashed var(--border-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'var(--space-8)',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <CalendarIcon size={24} opacity={0.5} />
                </div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Wybierz datę z kalendarza,<br />aby zobaczyć dostępne godziny.</p>
              </motion.div>
            ) : (
              <motion.div
                key={pickedDate}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ height: '100%' }}
              >
                <div style={{ 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-xl)', 
                  border: '1px solid var(--border-primary)',
                  padding: 'var(--space-5)',
                }}>
                  <div style={{ marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                      {formatDateLong(pickedDate)}
                    </div>
                    {loadingSlots && <div className="spinner" style={{ width: 14, height: 14 }} />}
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))', 
                    gap: 8,
                    maxHeight: 320,
                    overflowY: 'auto',
                    paddingRight: 4
                  }}>
                    {ALL_SLOTS.map((slot, i) => {
                      const isTaken = takenSlots.includes(slot);
                      const isSelected = slot === pickedTime;
                      
                      return (
                        <motion.button
                          key={slot}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.01 }}
                          disabled={isTaken}
                          onClick={() => handleTimeClick(slot)}
                          style={{
                            padding: '10px 0',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '13px',
                            fontWeight: 700,
                            border: isSelected ? 'none' : '1px solid var(--border-primary)',
                            background: isSelected ? 'var(--accent-primary)' : isTaken ? 'transparent' : 'var(--bg-elevated)',
                            color: isSelected ? '#fff' : isTaken ? 'var(--text-muted)' : 'var(--text-primary)',
                            cursor: isTaken ? 'not-allowed' : 'pointer',
                            opacity: isTaken ? 0.3 : 1,
                            transition: 'all 0.2s ease',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          {slot}
                          {isSelected && (
                            <motion.div 
                              layoutId="active-slot-glow"
                              style={{ position: 'absolute', inset: 0, background: 'var(--accent-primary-glow)', zIndex: -1 }} 
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-5)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-primary)' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                      Wybrany
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border-primary)' }} />
                      Zajęty
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <style jsx global>{`
        @media (max-width: 700px) {
          .date-time-grid { grid-template-columns: 1fr !important; gap: var(--space-8) !important; }
        }
      `}</style>
    </div>
  );
}
