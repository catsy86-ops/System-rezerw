import { describe, it, expect } from 'vitest';
import { generateSlots, calculateTakenSlots } from '../bookingHelpers';
import type { Reservation } from '@/types';

// Mock helper to generate mock reservations
function makeMockReservation(time: string, duration: number, status: 'oczekujaca' | 'potwierdzona' | 'anulowana' = 'potwierdzona'): Reservation {
  return {
    id: 'res-mock',
    serviceId: 'srv-1',
    serviceName: 'Test Service',
    servicePrice: 100,
    serviceDuration: duration,
    clientId: 'cli-mock',
    clientFirstName: 'John',
    clientLastName: 'Doe',
    clientEmail: 'john@example.com',
    clientPhone: '123456789',
    date: '2026-06-06',
    time,
    status,
    notes: '',
    createdAt: '2026-06-06T10:00:00Z',
    updatedAt: '2026-06-06T10:00:00Z',
  };
}

describe('bookingHelpers', () => {
  describe('generateSlots', () => {
    it('should generate slots between open and close times with given interval', () => {
      const slots = generateSlots('08:00', '10:00', 30);
      expect(slots).toEqual(['08:00', '08:30', '09:00', '09:30']);
    });

    it('should handle 60 minute intervals', () => {
      const slots = generateSlots('08:00', '11:00', 60);
      expect(slots).toEqual(['08:00', '09:00', '10:00']);
    });
  });

  describe('calculateTakenSlots', () => {
    const allSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'];
    const closeTime = '11:30';

    it('should return empty taken list when there are no reservations and not today', () => {
      const taken = calculateTakenSlots({
        date: '2026-06-07',
        reservations: [],
        serviceDuration: 30,
        allSlots,
        closeTime,
        intervalMinutes: 30,
        isToday: false,
      });
      expect(taken).toEqual([]);
    });

    it('should block slots that would exceed closing time', () => {
      // Service takes 60 minutes
      // Last slot starts at 11:00, which ends at 12:00. Closing time is 11:30.
      // So 11:00 slot ends after closeTime and should be blocked.
      // Slot 10:30 ends at 11:30 (exactly closing), so it should NOT be blocked.
      const taken = calculateTakenSlots({
        date: '2026-06-07',
        reservations: [],
        serviceDuration: 60,
        allSlots,
        closeTime,
        intervalMinutes: 30,
        isToday: false,
      });
      expect(taken).toContain('11:00');
      expect(taken).not.toContain('10:30');
    });

    it('should block slots overlapping with active reservations', () => {
      // Reservation at 09:00 with duration 60 mins (ends at 10:00)
      const reservations = [makeMockReservation('09:00', 60)];
      
      // New service of 30 mins
      const taken = calculateTakenSlots({
        date: '2026-06-07',
        reservations,
        serviceDuration: 30,
        allSlots,
        closeTime,
        intervalMinutes: 30,
        isToday: false,
      });

      // Should block 09:00 and 09:30
      expect(taken).toContain('09:00');
      expect(taken).toContain('09:30');
      // Should NOT block 08:30 (ends at 09:00) and 10:00 (starts at 10:00)
      expect(taken).not.toContain('08:30');
      expect(taken).not.toContain('10:00');
    });

    it('should NOT block slots overlapping with cancelled reservations', () => {
      const reservations = [makeMockReservation('09:00', 60, 'anulowana')];
      
      const taken = calculateTakenSlots({
        date: '2026-06-07',
        reservations,
        serviceDuration: 30,
        allSlots,
        closeTime,
        intervalMinutes: 30,
        isToday: false,
      });

      expect(taken).toEqual([]);
    });

    it('should block past slots if booking date is today', () => {
      // Current time is 09:15 AM (555 minutes)
      const currentMinutes = 9 * 60 + 15;

      const taken = calculateTakenSlots({
        date: '2026-06-06',
        reservations: [],
        serviceDuration: 30,
        allSlots,
        closeTime,
        intervalMinutes: 30,
        isToday: true,
        currentMinutes,
      });

      // 08:00, 08:30, 09:00 should be blocked because they are <= 09:15
      expect(taken).toContain('08:00');
      expect(taken).toContain('08:30');
      expect(taken).toContain('09:00');
      // 09:30, 10:00 etc. should NOT be blocked
      expect(taken).not.toContain('09:30');
      expect(taken).not.toContain('10:00');
    });
  });
});
