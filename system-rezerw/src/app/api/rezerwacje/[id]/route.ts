// ============================================================
// API — /api/rezerwacje/[id]  (PUT, DELETE)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAllReservations, saveAllReservations } from '@/lib/db';

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/rezerwacje/[id]
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email')?.toLowerCase();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Brak adresu e-mail do weryfikacji' }, { status: 400 });
    }

    const reservations = getAllReservations();
    const reservation = reservations.find(r => r.id === id);

    if (!reservation) {
      return NextResponse.json({ success: false, error: 'Rezerwacja nie istnieje' }, { status: 404 });
    }

    if (reservation.clientEmail.toLowerCase() !== email) {
      return NextResponse.json({ success: false, error: 'Niepoprawny adres e-mail dla tej rezerwacji' }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: reservation });
  } catch {
    return NextResponse.json({ success: false, error: 'Błąd pobierania rezerwacji' }, { status: 500 });
  }
}

// PUT /api/rezerwacje/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const reservations = getAllReservations();
    const idx = reservations.findIndex(r => r.id === id);

    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Rezerwacja nie istnieje' }, { status: 404 });
    }

    reservations[idx] = {
      ...reservations[idx],
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };

    saveAllReservations(reservations);
    return NextResponse.json({ success: true, data: reservations[idx] });
  } catch {
    return NextResponse.json({ success: false, error: 'Błąd aktualizacji rezerwacji' }, { status: 500 });
  }
}

// DELETE /api/rezerwacje/[id]
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const reservations = getAllReservations();
    const idx = reservations.findIndex(r => r.id === id);

    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Rezerwacja nie istnieje' }, { status: 404 });
    }

    // Soft-delete: zmień status na anulowana
    reservations[idx].status = 'anulowana';
    reservations[idx].updatedAt = new Date().toISOString();
    saveAllReservations(reservations);

    return NextResponse.json({ success: true, data: { id } });
  } catch {
    return NextResponse.json({ success: false, error: 'Błąd usuwania rezerwacji' }, { status: 500 });
  }
}
