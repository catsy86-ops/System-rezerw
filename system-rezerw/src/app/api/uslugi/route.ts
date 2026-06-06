// ============================================================
// API — /api/uslugi  (GET, POST)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAllServices, saveAllServices, generateId } from '@/lib/db';
import { serviceSchema } from '@/lib/validators';
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
    
    // Walidacja Zod
    const result = serviceSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Błąd walidacji danych usługi', 
        details: result.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const serviceData = result.data;

    const service: Service = {
      ...serviceData,
      id: generateId('svc'),
    };

    const services = getAllServices();
    services.push(service);
    await saveAllServices(services);

    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Błąd tworzenia usługi' }, { status: 500 });
  }
}
