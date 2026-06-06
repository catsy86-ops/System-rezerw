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
  generateId,
} from '@/lib/db';
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
    const { serviceId, date, time, firstName, lastName, email, phone, notes } = body;

    if (!serviceId || !date || !time || !firstName || !lastName || !email || !phone) {
      return NextResponse.json({ success: false, error: 'Brakujące wymagane pola' }, { status: 400 });
    }

    const services = getAllServices();
    const service = services.find(s => s.id === serviceId);
    if (!service) {
      return NextResponse.json({ success: false, error: 'Usługa nie istnieje' }, { status: 404 });
    }
    if (!service.active) {
      return NextResponse.json({ success: false, error: 'Usługa jest nieaktywna' }, { status: 400 });
    }

    // Sprawdź kolizję terminów
    const existing = getAllReservations().filter(
      r => r.date === date && r.status !== 'anulowana'
    );
    const newStart = timeToMinutes(time);
    const newEnd = newStart + service.duration;

    const conflict = existing.find(r => {
      const rStart = timeToMinutes(r.time);
      const rEnd = rStart + r.serviceDuration;
      return newStart < rEnd && newEnd > rStart;
    });

    if (conflict) {
      return NextResponse.json(
        { success: false, error: 'Wybrany termin jest już zajęty' },
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
    }

    // Aktualizuj statystyki klienta
    client.totalBookings += 1;
    client.totalSpent += service.price;
    saveAllClients(clients);

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
    saveAllReservations(reservations);

    return NextResponse.json({ success: true, data: reservation }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Błąd tworzenia rezerwacji' }, { status: 500 });
  }
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
