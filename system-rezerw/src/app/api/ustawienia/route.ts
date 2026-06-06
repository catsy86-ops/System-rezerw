// ============================================================
// API — /api/ustawienia  (GET, PUT)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/db';
import type { BusinessSettings } from '@/types';

export async function GET() {
  try {
    const settings = getSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch {
    return NextResponse.json({ success: false, error: 'Błąd pobierania ustawień' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json() as BusinessSettings;
    saveSettings(body);
    return NextResponse.json({ success: true, data: body });
  } catch {
    return NextResponse.json({ success: false, error: 'Błąd zapisu ustawień' }, { status: 500 });
  }
}
