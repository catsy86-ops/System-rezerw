// ============================================================
// API — /api/rezerwacje  (GET, POST)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  getAllReservations,
  saveAllReservations,
  getAllServices,
  getAllClients,
  saveAllClients,
  getSettings,
  generateId,
  recalculateClientStats,
} from '@/lib/db';
import { isDateInPast } from '@/lib/formatters';
import { bookingSchema } from '@/lib/validators';
import type { Reservation, ReservationStatus } from '@/types';

// GET /api/rezerwacje
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const serviceId = searchParams.get('serviceId');
    const search = searchParams.get('search')?.toLowerCase();

    let reservations = getAllReservations();

    if (status && status !== 'wszystkie') {
      reservations = reservations.filter(r => r.status === status);
    }
    if (dateFrom) {
      reservations = reservations.filter(r => r.date >= dateFrom);
    }
    if (dateTo) {
      reservations = reservations.filter(r => r.date <= dateTo);
    }
    if (serviceId) {
      reservations = reservations.filter(r => r.serviceId === serviceId);
    }
    if (search) {
      reservations = reservations.filter(r =>
        r.clientFirstName.toLowerCase().includes(search) ||
        r.clientLastName.toLowerCase().includes(search) ||
        r.clientEmail.toLowerCase().includes(search) ||
        r.serviceName.toLowerCase().includes(search)
      );
    }

    // Sort by date + time descending
    reservations.sort((a, b) => {
      const da = `${a.date}T${a.time}`;
      const db = `${b.date}T${b.time}`;
      return db.localeCompare(da);
    });

    return NextResponse.json({ success: true, data: reservations, total: reservations.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Błąd pobierania rezerwacji' }, { status: 500 });
  }
}

// POST /api/rezerwacje
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Walidacja Zod
    const result = bookingSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Błąd walidacji danych', 
        details: result.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const { serviceId, date, time, firstName, lastName, email, phone, notes } = result.data;

    if (isDateInPast(date)) {
      return NextResponse.json({ success: false, error: 'Nie można zarezerwować terminu w przeszłości' }, { status: 400 });
    }

    const services = getAllServices();
    const service = services.find(s => s.id === serviceId);
    if (!service) {
      return NextResponse.json({ success: false, error: 'Usługa nie istnieje' }, { status: 404 });
    }
    if (!service.active) {
      return NextResponse.json({ success: false, error: 'Usługa jest nieaktywna' }, { status: 400 });
    }

    const settings = getSettings();
    const buffer = settings.bufferTime || 0;

    // Sprawdź kolizję terminów (z uwzględnieniem bufora)
    const existing = getAllReservations().filter(
      r => r.date === date && r.status !== 'anulowana'
    );
    const newStart = timeToMinutes(time);
    const newEndWithBuffer = newStart + service.duration + buffer;

    const conflict = existing.find(r => {
      const rStart = timeToMinutes(r.time);
      const rEndWithBuffer = rStart + r.serviceDuration + buffer;
      return newStart < rEndWithBuffer && newEndWithBuffer > rStart;
    });

    if (conflict) {
      return NextResponse.json(
        { success: false, error: 'Wybrany termin (lub wymagany bufor po nim) jest już zajęty' },
        { status: 409 }
      );
    }

    // Znajdź lub utwórz klienta
    const clients = getAllClients();
    let client = clients.find(c => c.email.toLowerCase() === email.toLowerCase());

    const now = new Date().toISOString();

    if (!client) {
      client = {
        id: generateId('cli'),
        firstName,
        lastName,
        email,
        phone,
        notes: '',
        createdAt: now,
        totalBookings: 0,
        totalSpent: 0,
      };
      clients.push(client);
      await saveAllClients(clients);
    }

    const reservation: Reservation = {
      id: generateId('res'),
      serviceId,
      serviceName: service.name,
      servicePrice: service.price,
      serviceDuration: service.duration,
      clientId: client.id,
      clientFirstName: firstName,
      clientLastName: lastName,
      clientEmail: email,
      clientPhone: phone,
      date,
      time,
      status: 'oczekujaca',
      notes: notes || '',
      createdAt: now,
      updatedAt: now,
    };

    const reservations = getAllReservations();
    reservations.push(reservation);
    await saveAllReservations(reservations);

    // Aktualizuj statystyki klienta
    await recalculateClientStats(client.id);

    return NextResponse.json({ success: true, data: reservation }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Błąd tworzenia rezerwacji' }, { status: 500 });
  }
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
