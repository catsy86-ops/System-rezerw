'use client';

// ============================================================
// KROK 2 — Wybór Daty i Godziny
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
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
import type { Reservation, Service } from '@/types';

const WORKING_DAYS = [1, 2, 3, 4, 5, 6]; // Mon-Sat
const OPEN_TIME = '08:00';
const CLOSE_TIME = '20:00';
const INTERVAL = 30;
const ALL_SLOTS = generateSlots(OPEN_TIME, CLOSE_TIME, INTERVAL);

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

  const fetchTakenSlots = useCallback(async (date: string) => {
    setLoadingSlots(true);
    try {
      const reservations = await reservationsApi.getAll({ dateFrom: date, dateTo: date });
      
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const isTodaySelected = date === getTodayString();

      const taken = calculateTakenSlots({
        date,
        reservations: reservations as unknown as Reservation[],
        serviceDuration: service.duration,
        allSlots: ALL_SLOTS,
        closeTime: CLOSE_TIME,
        intervalMinutes: INTERVAL,
        isToday: isTodaySelected,
        currentMinutes,
      });

      setTakenSlots(taken);
    } catch {
      setTakenSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [service.duration]);

  useEffect(() => {
    if (pickedDate) fetchTakenSlots(pickedDate);
  }, [pickedDate, fetchTakenSlots]);

  // Calendar days
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const adjustedFirst = (firstDay + 6) % 7; // Mon=0

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
    if (pickedDate) {
      onSelect(pickedDate, slot);
    }
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Service info */}
      <div
        className="glass-card"
        style={{
          padding: 'var(--space-4) var(--space-5)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          borderLeft: `3px solid ${service.color}`,
        }}
      >
        <span style={{ fontSize: '1.8rem' }}>{service.icon}</span>
        <div>
          <div style={{ fontWeight: 600 }}>{service.name}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'flex', gap: 'var(--space-3)', marginTop: 2 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={11} /> {formatDuration(service.duration)}
            </span>
            <span style={{ color: service.color, fontWeight: 600 }}>
              {new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', minimumFractionDigits: 0 }).format(service.price)}
            </span>
          </div>
        </div>
      </div>

      <div className="date-time-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* Calendar */}
        <div>
          <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
            Wybierz datę
          </h3>
          <div className="calendar">
            <div className="calendar-header">
              <button className="btn btn-ghost btn-icon" onClick={prevMonth} aria-label="Poprzedni miesiąc">
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                {MONTHS_PL[viewMonth]} {viewYear}
              </span>
              <button className="btn btn-ghost btn-icon" onClick={nextMonth} aria-label="Następny miesiąc">
                <ChevronRight size={16} />
              </button>
            </div>

            <div style={{ padding: 'var(--space-3)' }}>
              {/* Day headers */}
              <div className="calendar-grid">
                {DAYS_SHORT_PL.slice(1).concat(DAYS_SHORT_PL[0]).map(d => (
                  <div key={d} className="calendar-day-header">{d}</div>
                ))}
              </div>

              {/* Days */}
              <div className="calendar-grid">
                {calDays.map((day, i) => {
                  if (day === null) {
                    return <div key={`empty-${i}`} className="calendar-day empty" />;
                  }
                  const ds = makeDateStr(day);
                  const isToday = ds === getTodayString();
                  const disabled = isDisabledDay(day);
                  const selected = ds === pickedDate;

                  return (
                    <button
                      key={day}
                      id={`day-${ds}`}
                      onClick={() => handleDayClick(day)}
                      disabled={disabled}
                      className={`calendar-day ${isToday ? 'today' : ''} ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                      aria-label={`${day} ${MONTHS_PL[viewMonth]}`}
                      aria-selected={selected}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
            Wybierz godzinę
          </h3>

          {!pickedDate ? (
            <div
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8)',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: 'var(--text-sm)',
              }}
            >
              ← Najpierw wybierz datę
            </div>
          ) : loadingSlots ? (
            <div className="loader-container" style={{ padding: 'var(--space-8)' }}>
              <div className="spinner" style={{ width: 28, height: 28 }} />
            </div>
          ) : (
            <div>
              {pickedDate && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
                  {formatDateLong(pickedDate)}
                </div>
              )}
              <div className="time-slots" style={{ maxHeight: 280, overflowY: 'auto' }}>
                {ALL_SLOTS.map(slot => {
                  const taken = takenSlots.includes(slot);
                  const selected = slot === pickedTime;
                  return (
                    <button
                      key={slot}
                      id={`slot-${slot}`}
                      onClick={() => handleTimeClick(slot)}
                      disabled={taken}
                      className={`time-slot ${selected ? 'selected' : ''} ${taken ? 'taken' : ''}`}
                      aria-label={`Godzina ${slot}${taken ? ' — zajęta' : ''}`}
                      aria-pressed={selected}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent-primary)', display: 'inline-block' }} />
                  Wybrany
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', display: 'inline-block', opacity: 0.4 }} />
                  Zajęty
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .date-time-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
