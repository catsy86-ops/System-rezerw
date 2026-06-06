// ============================================================
// HELPERY REZERWACJI — Generowanie slotów i obliczanie kolizji
// ============================================================

import type { Reservation } from '@/types';
import { addMinutes } from './formatters';

/**
 * Generuje tablicę godzinnych slotów czasowych (np. ["08:00", "08:30", ...])
 * w przedziale od `open` do `close` z zachowaniem odstępu `interval` w minutach.
 */
export function generateSlots(open: string, close: string, interval: number): string[] {
  const slots: string[] = [];
  const [oh, om] = open.split(':').map(Number);
  const [ch, cm] = close.split(':').map(Number);
  let cur = oh * 60 + om;
  const end = ch * 60 + cm;
  while (cur < end) {
    const h = Math.floor(cur / 60).toString().padStart(2, '0');
    const m = (cur % 60).toString().padStart(2, '0');
    slots.push(`${h}:${m}`);
    cur += interval;
  }
  return slots;
}

interface CalculateTakenSlotsParams {
  date: string;
  reservations: Reservation[];
  serviceDuration: number;
  allSlots: string[];
  closeTime: string;
  intervalMinutes: number;
  isToday: boolean;
  currentMinutes?: number;
  bufferMinutes?: number;
}

/**
 * Oblicza listę zablokowanych (zajętych) slotów godzinowych na podstawie:
 * - istniejących rezerwacji (nakładanie się czasowe usługi + czas buforowy)
 * - przekroczenia godziny zamknięcia salonu
 * - slotów z przeszłości (jeżeli rezerwacja jest robiona na dziś)
 */
export function calculateTakenSlots({
  reservations,
  serviceDuration,
  allSlots,
  closeTime,
  isToday,
  currentMinutes = 0,
  bufferMinutes = 0,
}: CalculateTakenSlotsParams): string[] {
  const activeReservations = reservations.filter((r) => r.status !== 'anulowana');
  const takenFull: string[] = [];

  allSlots.forEach((slot) => {
    const slotEnd = addMinutes(slot, serviceDuration);

    // 1. Sprawdź, czy usługa nie wykracza poza godzinę zamknięcia
    if (slotEnd > closeTime) {
      takenFull.push(slot);
      return;
    }

    // 2. Sprawdź, czy termin nie nakłada się na istniejącą rezerwację (z uwzględnieniem bufora)
    const overlaps = activeReservations.some((r) => {
      const rStart = r.time;
      const rEndWithBuffer = addMinutes(r.time, r.serviceDuration + bufferMinutes);
      const slotEndWithBuffer = addMinutes(slot, serviceDuration + bufferMinutes);
      
      // Nowy slot zaczyna się przed zakończeniem istniejącej (z buforem) 
      // ORAZ Nowy slot (z buforem) kończy się po rozpoczęciu istniejącej
      return slot < rEndWithBuffer && slotEndWithBuffer > rStart;
    });

    if (overlaps) {
      takenFull.push(slot);
      return;
    }

    // 3. Sprawdź, czy slot nie leży w przeszłości (dla rezerwacji na dziś)
    if (isToday) {
      const [slotH, slotM] = slot.split(':').map(Number);
      const slotMinutes = slotH * 60 + slotM;
      if (slotMinutes <= currentMinutes) {
        takenFull.push(slot);
        return;
      }
    }
  });

  return takenFull;
}
