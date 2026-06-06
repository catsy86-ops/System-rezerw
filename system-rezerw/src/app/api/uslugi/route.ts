// ============================================================
// API — /api/uslugi  (GET, POST)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAllServices, saveAllServices, generateId } from '@/lib/db';
import type { Service } from '@/types';

export async function GET() {
  try {
    const services = getAllServices();
    return NextResponse.json({ success: true, data: services });
  } catch {
    return NextResponse.json({ success: false, error: 'Błąd pobierania usług' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, duration, price, category, icon, color, active } = body;

    if (!name || !description || !duration || price === undefined) {
      return NextResponse.json({ success: false, error: 'Brakujące wymagane pola' }, { status: 400 });
    }

    const service: Service = {
      id: generateId('svc'),
      name,
      description,
      duration: Number(duration),
      price: Number(price),
      category: category || 'inne',
      icon: icon || '⭐',
      active: active ?? true,
      color: color || '#10B981',
    };

    const services = getAllServices();
    services.push(service);
    saveAllServices(services);

    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Błąd tworzenia usługi' }, { status: 500 });
  }
}
