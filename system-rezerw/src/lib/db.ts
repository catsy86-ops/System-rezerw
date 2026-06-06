// ============================================================
// DATABASE HELPERS — JSON file read/write
// ============================================================

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

function getFilePath(filename: string): string {
  return path.join(DATA_DIR, filename);
}

export function readJson<T>(filename: string): T {
  const filePath = getFilePath(filename);
  if (!fs.existsSync(filePath)) {
    // Return default empty structures if file doesn't exist
    if (filename === 'rezerwacje.json') return { reservations: [] } as unknown as T;
    if (filename === 'uslugi.json') return { services: [] } as unknown as T;
    if (filename === 'klienci.json') return { clients: [] } as unknown as T;
    if (filename === 'ustawienia.json') return { settings: {} } as unknown as T;
    return {} as T;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error parsing ${filename}:`, e);
    // Return empty if corrupted
    if (filename === 'rezerwacje.json') return { reservations: [] } as unknown as T;
    if (filename === 'uslugi.json') return { services: [] } as unknown as T;
    if (filename === 'klienci.json') return { clients: [] } as unknown as T;
    return {} as T;
  }
}

// Simple in-memory lock to prevent concurrent writes in the same process
const locks: Record<string, Promise<any>> = {};

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  const filePath = getFilePath(filename);
  
  // Wait for previous write on this file to finish
  const prevLock = locks[filename];
  if (prevLock) {
    await prevLock.catch(() => {}); // ignore errors in previous lock
  }

  let resolveLock: (value?: any) => void;
  locks[filename] = new Promise((resolve) => {
    resolveLock = resolve;
  });

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } finally {
    resolveLock!();
  }
}

export function generateId(prefix: string): string {
  return `${prefix}-${uuidv4().slice(0, 8)}`;
}

// ── Rezerwacje ───────────────────────────────────────────────
import type { Reservation } from '@/types';

export function getAllReservations(): Reservation[] {
  const data = readJson<{ reservations: Reservation[] }>('rezerwacje.json');
  return data.reservations;
}

export async function saveAllReservations(reservations: Reservation[]): Promise<void> {
  await writeJson('rezerwacje.json', { reservations });
}

// ── Usługi ────────────────────────────────────────────────────
import type { Service } from '@/types';

export function getAllServices(): Service[] {
  const data = readJson<{ services: Service[] }>('uslugi.json');
  return data.services;
}

export async function saveAllServices(services: Service[]): Promise<void> {
  await writeJson('uslugi.json', { services });
}

// ── Klienci ───────────────────────────────────────────────────
import type { Client } from '@/types';

export function getAllClients(): Client[] {
  const data = readJson<{ clients: Client[] }>('klienci.json');
  return data.clients;
}

export async function saveAllClients(clients: Client[]): Promise<void> {
  await writeJson('klienci.json', { clients });
}

export async function recalculateClientStats(clientId: string): Promise<void> {
  const reservations = getAllReservations();
  const clients = getAllClients();
  const clientIdx = clients.findIndex(c => c.id === clientId);
  
  if (clientIdx === -1) return;

  const clientReservations = reservations.filter(r => r.clientId === clientId);
  
  // totalBookings: all except cancelled
  const activeReservations = clientReservations.filter(r => r.status !== 'anulowana');
  clients[clientIdx].totalBookings = activeReservations.length;

  // totalSpent: only completed ones
  const completedReservations = clientReservations.filter(r => r.status === 'zakonczona');
  clients[clientIdx].totalSpent = completedReservations.reduce((sum, r) => sum + r.servicePrice, 0);

  await saveAllClients(clients);
}

// ── Ustawienia ────────────────────────────────────────────────
import type { BusinessSettings } from '@/types';

export function getSettings(): BusinessSettings {
  const data = readJson<{ settings: BusinessSettings }>('ustawienia.json');
  return data.settings;
}

export async function saveSettings(settings: BusinessSettings): Promise<void> {
  await writeJson('ustawienia.json', { settings });
}

export { uuidv4 };
