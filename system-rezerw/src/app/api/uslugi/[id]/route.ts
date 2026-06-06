// ============================================================
// API — /api/uslugi/[id]  (PUT, DELETE)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAllServices, saveAllServices } from '@/lib/db';

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const services = getAllServices();
    const idx = services.findIndex(s => s.id === id);

    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Usługa nie istnieje' }, { status: 404 });
    }

    services[idx] = { ...services[idx], ...body, id };
    await saveAllServices(services);

    return NextResponse.json({ success: true, data: services[idx] });
  } catch {
    return NextResponse.json({ success: false, error: 'Błąd aktualizacji usługi' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const services = getAllServices();
    const idx = services.findIndex(s => s.id === id);

    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Usługa nie istnieje' }, { status: 404 });
    }

    services.splice(idx, 1);
    await saveAllServices(services);

    return NextResponse.json({ success: true, data: { id } });
  } catch {
    return NextResponse.json({ success: false, error: 'Błąd usuwania usługi' }, { status: 500 });
  }
}
