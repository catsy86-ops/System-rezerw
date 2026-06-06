'use client';

// ============================================================
// PANEL — USTAWIENIA
// ============================================================

import { useState, useEffect } from 'react';
import { Save, Loader2, Building2, Clock, Calendar, AlertCircle, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { DAYS_PL, SLOT_INTERVALS } from '@/lib/constants';
import type { BusinessSettings } from '@/types';

const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: '',
  businessEmail: '',
  businessPhone: '',
  businessAddress: '',
  openTime: '08:00',
  closeTime: '06:00',
  slotInterval: 30,
  bufferTime: 0,
  workingDays: [0, 1, 2, 3, 4, 5, 6],

  currency: 'PLN',
  timezone: 'Europe/Warsaw',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetch('/api/ustawienia')
      .then(r => r.json())
      .then(d => {
        if (d.success) setSettings(d.data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/ustawienia', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
      toast.success('Ustawienia zapisane', 'Zmiany zostały zastosowane');
    } catch {
      toast.error('Błąd', 'Nie udało się zapisać ustawień');
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (day: number) => {
    setSettings(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day].sort(),
    }));
  };

  const set = (field: keyof BusinessSettings, value: unknown) =>
    setSettings(prev => ({ ...prev, [field]: value }));

  if (loading) {
    return <div className="loader-container"><div className="spinner" /></div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-1)' }}>Ustawienia</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Konfiguracja salonu i systemu rezerwacji</p>
        </div>
        <button id="save-settings-btn" className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
          Zapisz zmiany
        </button>
      </div>

      {/* Business Info */}
      <Section icon={<Building2 size={18} />} title="Informacje o salonie">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="biz-name">Nazwa salonu</label>
            <input id="biz-name" className="form-input" value={settings.businessName} onChange={e => set('businessName', e.target.value)} placeholder="Nocny Promil" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="biz-phone">Telefon</label>
            <input id="biz-phone" className="form-input" value={settings.businessPhone} onChange={e => set('businessPhone', e.target.value)} placeholder="+48 12 345 67 89" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="biz-email">Email kontaktowy</label>
          <input id="biz-email" type="email" className="form-input" value={settings.businessEmail} onChange={e => set('businessEmail', e.target.value)} placeholder="kontakt@salon.pl" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="biz-address">Adres</label>
          <input id="biz-address" className="form-input" value={settings.businessAddress} onChange={e => set('businessAddress', e.target.value)} placeholder="ul. Kwiatowa 15, 30-001 Kraków" />
        </div>
      </Section>

      {/* Hours */}
      <Section icon={<Clock size={18} />} title="Godziny pracy i interwały">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="open-time">Otwarcie</label>
            <input id="open-time" type="time" className="form-input" value={settings.openTime} onChange={e => set('openTime', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="close-time">Zamknięcie</label>
            <input id="close-time" type="time" className="form-input" value={settings.closeTime} onChange={e => set('closeTime', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="slot-interval">Interwał slotów</label>
            <select id="slot-interval" className="form-input form-select" value={settings.slotInterval} onChange={e => set('slotInterval', Number(e.target.value))}>
              {SLOT_INTERVALS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="buffer-time">Przerwa (bufor)</label>
            <select id="buffer-time" className="form-input form-select" value={settings.bufferTime} onChange={e => set('bufferTime', Number(e.target.value))}>
              {[0, 5, 10, 15, 20, 30].map(v => (
                <option key={v} value={v}>{v} minut</option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      {/* Working Days */}
      <Section icon={<Calendar size={18} />} title="Dni robocze">
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          {DAYS_PL.map((day, i) => {
            const active = settings.workingDays.includes(i);
            return (
              <button
                key={i}
                id={`day-toggle-${i}`}
                type="button"
                onClick={() => toggleDay(i)}
                className={`btn btn-sm ${active ? 'btn-primary' : 'btn-secondary'}`}
                style={{ minWidth: 90 }}
              >
                {day}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          Aktywne dni: {settings.workingDays.map(d => DAYS_PL[d]).join(', ')}
        </div>
      </Section>

      {/* Exceptions */}
      <Section icon={<AlertCircle size={18} />} title="Wyjątki w grafikach (Święta/Dni wolne)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {(settings.workingHoursExceptions || []).map((ex, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 glass-card">
              <input 
                type="date" 
                className="form-input" 
                value={ex.date} 
                onChange={e => {
                  const newEx = [...(settings.workingHoursExceptions || [])];
                  newEx[idx].date = e.target.value;
                  set('workingHoursExceptions', newEx);
                }} 
              />
              <label className="flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  checked={ex.isOpen} 
                  onChange={e => {
                    const newEx = [...(settings.workingHoursExceptions || [])];
                    newEx[idx].isOpen = e.target.checked;
                    set('workingHoursExceptions', newEx);
                  }}
                />
                Otwarte
              </label>
              {ex.isOpen && (
                <>
                  <input 
                    type="time" 
                    className="form-input" 
                    value={ex.openTime} 
                    onChange={e => {
                      const newEx = [...(settings.workingHoursExceptions || [])];
                      newEx[idx].openTime = e.target.value;
                      set('workingHoursExceptions', newEx);
                    }}
                  />
                  <input 
                    type="time" 
                    className="form-input" 
                    value={ex.closeTime} 
                    onChange={e => {
                      const newEx = [...(settings.workingHoursExceptions || [])];
                      newEx[idx].closeTime = e.target.value;
                      set('workingHoursExceptions', newEx);
                    }}
                  />
                </>
              )}
              <button 
                className="btn btn-ghost btn-icon" 
                onClick={() => {
                  const newEx = settings.workingHoursExceptions?.filter((_, i) => i !== idx);
                  set('workingHoursExceptions', newEx);
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => {
              const newEx = [...(settings.workingHoursExceptions || []), { date: '', isOpen: false, openTime: '08:00', closeTime: '20:00' }];
              set('workingHoursExceptions', newEx);
            }}
          >
            <Plus size={14} /> Dodaj wyjątek
          </button>
        </div>
      </Section>

      {/* Google Calendar Sync */}
      <Section icon={<div style={{ width: 18, height: 18, background: '#4285F4', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 900 }}>G</div>} title="Integracja z Kalendarzem Google">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Synchronizuj zamówienia Nocny Promil ze swoim prywatnym kalendarzem Google. Pracownicy będą mogli widzieć grafik na swoich telefonach.
          </p>
          
          <div style={{ padding: 'var(--space-4)', background: 'rgba(66, 133, 244, 0.05)', border: '1px solid rgba(66, 133, 244, 0.2)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ width: 32, height: 32, background: '#4285F4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Calendar size={16} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Status: Niepołączono</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Kliknij przycisk, aby autoryzować konto</div>
              </div>
            </div>
            <button className="btn btn-primary btn-sm" style={{ background: '#4285F4', borderColor: '#4285F4' }}>
              Połącz z Google
            </button>
          </div>

          <div className="divider" style={{ margin: 0 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" disabled />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Automatycznie dodawaj nowe rezerwacje do kalendarza</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" disabled />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Blokuj terminy na podstawie wydarzeń prywatnych</span>
            </label>
          </div>
        </div>
      </Section>

      {/* Mobile save */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
          Zapisz wszystkie ustawienia
        </button>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-primary)' }}>
        <div style={{ width: 36, height: 36, background: 'rgba(16,185,129,0.1)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
          {icon}
        </div>
        <h2 style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>{title}</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {children}
      </div>
    </div>
  );
}
