// ============================================================
// API — /api/klienci  (GET)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAllClients } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase();

    let clients = getAllClients();

    if (search) {
      clients = clients.filter(c =>
        c.firstName.toLowerCase().includes(search) ||
        c.lastName.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.phone.includes(search)
      );
    }

    clients.sort((a, b) => b.totalBookings - a.totalBookings);

    return NextResponse.json({ success: true, data: clients, total: clients.length });
  } catch {
    return NextResponse.json({ success: false, error: 'Błąd pobierania klientów' }, { status: 500 });
  }
}
