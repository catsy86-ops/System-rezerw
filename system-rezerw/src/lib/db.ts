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
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

export function writeJson<T>(filename: string, data: T): void {
  const filePath = getFilePath(filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
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

export function saveAllReservations(reservations: Reservation[]): void {
  writeJson('rezerwacje.json', { reservations });
}

// ── Usługi ────────────────────────────────────────────────────
import type { Service } from '@/types';

export function getAllServices(): Service[] {
  const data = readJson<{ services: Service[] }>('uslugi.json');
  return data.services;
}

export function saveAllServices(services: Service[]): void {
  writeJson('uslugi.json', { services });
}

// ── Klienci ───────────────────────────────────────────────────
import type { Client } from '@/types';

export function getAllClients(): Client[] {
  const data = readJson<{ clients: Client[] }>('klienci.json');
  return data.clients;
}

export function saveAllClients(clients: Client[]): void {
  writeJson('klienci.json', { clients });
}

// ── Ustawienia ────────────────────────────────────────────────
import type { BusinessSettings } from '@/types';

export function getSettings(): BusinessSettings {
  const data = readJson<{ settings: BusinessSettings }>('ustawienia.json');
  return data.settings;
}

export function saveSettings(settings: BusinessSettings): void {
  writeJson('ustawienia.json', { settings });
}

export { uuidv4 };
