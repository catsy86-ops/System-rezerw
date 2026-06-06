'use client';

// ============================================================
// PANEL — REZERWACJE (Tabela, Kalendarz, Edycja, Eksport)
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Edit,
  Download,
  CalendarDays,
  Table,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Scissors
} from 'lucide-react';
import { reservationsApi, servicesApi } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/ToastProvider';
import { STATUS_LABELS } from '@/lib/constants';
import type { Reservation, ReservationStatus, Service } from '@/types';

const STATUSES: (ReservationStatus | 'wszystkie')[] = ['wszystkie', 'oczekujaca', 'potwierdzona', 'zakonczona', 'anulowana'];

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'wszystkie'>('wszystkie');
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  // Edycja rezerwacji
  const [editing, setEditing] = useState<Reservation | null>(null);

  // Widok kalendarza i nawigacja po tygodniach
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Poniedziałek
    return new Date(d.setDate(diff));
  });

  const toast = useToast();

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (statusFilter !== 'wszystkie') params.status = statusFilter;
    if (search) params.search = search;
    
    try {
      const [res, svcs] = await Promise.all([
        reservationsApi.getAll(params),
        servicesApi.getAll(),
      ]);
      setReservations(res as unknown as Reservation[]);
      setServices(svcs as unknown as Service[]);
    } catch {
      toast.error('Błąd pobierania danych', 'Nie udało się wczytać rezerwacji lub usług.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, toast]);

  useEffect(() => {
    const t = setTimeout(fetchAll, 300);
    return () => clearTimeout(t);
  }, [fetchAll]);

  const updateStatus = async (id: string, status: ReservationStatus) => {
    setUpdating(id);
    try {
      await reservationsApi.update(id, { status });
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
      toast.success('Status zaktualizowany', `Rezerwacja oznaczona jako: ${STATUS_LABELS[status]}`);
    } catch {
      toast.error('Błąd', 'Nie udało się zaktualizować statusu');
    } finally {
      setUpdating(null);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    try {
      const selectedService = services.find(s => s.id === editing.serviceId);
      const updated = await reservationsApi.update(editing.id, {
        serviceId: editing.serviceId,
        serviceName: selectedService?.name || editing.serviceName,
        servicePrice: selectedService?.price || editing.servicePrice,
        serviceDuration: selectedService?.duration || editing.serviceDuration,
        date: editing.date,
        time: editing.time,
        clientFirstName: editing.clientFirstName,
        clientLastName: editing.clientLastName,
        clientEmail: editing.clientEmail,
        clientPhone: editing.clientPhone,
        notes: editing.notes,
        status: editing.status,
      });

      setReservations(prev => prev.map(r => r.id === editing.id ? updated : r));
      setEditing(null);
      toast.success('Zapisano zmiany', 'Rezerwacja została pomyślnie zaktualizowana.');
      fetchAll();
    } catch (err: any) {
      toast.error('Błąd zapisu', err.message || 'Nie udało się zaktualizować rezerwacji. Sprawdź poprawność danych.');
    }
  };

  // Eksport do pliku CSV
  const handleExportCSV = () => {
    if (reservations.length === 0) {
      toast.error('Brak danych', 'Brak rezerwacji do wyeksportowania.');
      return;
    }

    const headers = ['ID', 'Klient Imię', 'Klient Nazwisko', 'Email', 'Telefon', 'Usługa', 'Data', 'Godzina', 'Cena (PLN)', 'Czas (min)', 'Status', 'Uwagi'];
    const rows = reservations.map(r => [
      r.id,
      r.clientFirstName,
      r.clientLastName,
      r.clientEmail,
      r.clientPhone,
      r.serviceName,
      r.date,
      r.time,
      r.servicePrice,
      r.serviceDuration,
      r.status,
      r.notes || ''
    ]);

    const csvContent = "\ufeff" 
      + [headers.join(';'), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(';'))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `rezerwacje_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Pomyślny eksport', 'Wyeksportowano listę rezerwacji do pliku CSV.');
  };

  const getServiceColor = (serviceId: string) =>
    services.find(s => s.id === serviceId)?.color || 'var(--accent-primary)';

  // Kalendarz helpery
  const daysOfWeek = (() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(currentWeekStart.getDate() + i);
      days.push(d);
    }
    return days;
  })();

  const navigateWeek = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      const d = new Date();
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      setCurrentWeekStart(new Date(d.setDate(diff)));
    } else {
      const newStart = new Date(currentWeekStart);
      newStart.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
      setCurrentWeekStart(newStart);
    }
  };

  // Filtruj rezerwacje dla widoku kalendarza (tylko w danym tygodniu)
  const getReservationsForDate = (dateStr: string) => {
    return reservations.filter(r => r.date === dateStr);
  };

  const getDayLabel = (date: Date) => {
    const days = ['Niedz', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'];
    return `${days[date.getDay()]} ${date.getDate()}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  // Godziny pracy
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 do 20:00

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-1)' }}>Rezerwacje</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Zarządzaj wszystkimi wizytami ({reservations.length})
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {/* Przełącznik Widok Tabela / Kalendarz */}
          <div className="glass-card" style={{ display: 'flex', padding: 2, borderRadius: 'var(--radius-lg)' }}>
            <button
              onClick={() => setViewMode('table')}
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px' }}
              title="Widok tabeli"
            >
              <Table size={14} />
              Tabela
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`btn btn-sm ${viewMode === 'calendar' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px' }}
              title="Grafik wizyt"
            >
              <CalendarDays size={14} />
              Grafik
            </button>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV} title="Eksport do pliku CSV">
            <Download size={14} />
            Eksport
          </button>
          <button className="btn btn-secondary btn-sm" onClick={fetchAll} aria-label="Odśwież">
            <RefreshCw size={14} />
            Odśwież
          </button>
        </div>
      </div>

      {/* Filters (only for Table view) */}
      {viewMode === 'table' && (
        <div className="glass-card" style={{ padding: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div className="search-wrapper" style={{ flex: '1 1 240px' }}>
            <Search size={14} className="search-icon" />
            <input
              id="reservation-search"
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Szukaj klienta, usługi..."
              className="form-input"
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>

          {/* Status filter */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {STATUSES.map(s => (
              <button
                key={s}
                id={`filter-${s}`}
                onClick={() => setStatusFilter(s)}
                className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Navigation (only for Calendar view) */}
      {viewMode === 'calendar' && (
        <div className="glass-card" style={{ padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => navigateWeek('prev')} title="Poprzedni tydzień">
              <ChevronLeft size={16} />
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => navigateWeek('today')}>
              Dzisiaj
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => navigateWeek('next')} title="Następny tydzień">
              <ChevronRight size={16} />
            </button>
          </div>
          <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>
            {formatDate(daysOfWeek[0].toISOString().slice(0, 10))} — {formatDate(daysOfWeek[6].toISOString().slice(0, 10))}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Wybierz kafelek, aby zarządzać rezerwacją
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          {loading ? (
            <div className="loader-container">
              <div className="spinner" />
            </div>
          ) : reservations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Filter size={24} style={{ color: 'var(--text-muted)' }} />
              </div>
              <p>Brak rezerwacji spełniających kryteria</p>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Klient</th>
                    <th>Usługa</th>
                    <th>Data i godzina</th>
                    <th>Kwota</th>
                    <th>Status</th>
                    <th>Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map(r => (
                    <tr key={r.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <div className="avatar">
                            {r.clientFirstName[0]}{r.clientLastName[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: 550, fontSize: 'var(--text-sm)' }}>
                              {r.clientFirstName} {r.clientLastName}
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                              {r.clientPhone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: getServiceColor(r.serviceId),
                              flexShrink: 0,
                            }}
                          />
                          {r.serviceName}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{formatDate(r.date)}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{r.time}</div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--accent-primary)', fontSize: 'var(--text-sm)' }}>
                        {formatCurrency(r.servicePrice)}
                      </td>
                      <td>
                        <StatusBadge status={r.status} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                          <button
                            id={`view-${r.id}`}
                            className="btn btn-ghost btn-icon"
                            onClick={() => setSelected(r)}
                            aria-label="Podgląd"
                            title="Podgląd"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            id={`edit-${r.id}`}
                            className="btn btn-ghost btn-icon"
                            onClick={() => setEditing(r)}
                            aria-label="Edytuj"
                            title="Edytuj rezerwację"
                          >
                            <Edit size={14} />
                          </button>
                          {r.status === 'oczekujaca' && (
                            <button
                              id={`confirm-${r.id}`}
                              className="btn btn-ghost btn-icon"
                              onClick={() => updateStatus(r.id, 'potwierdzona')}
                              disabled={updating === r.id}
                              aria-label="Potwierdź"
                              title="Potwierdź"
                              style={{ color: 'var(--status-success)' }}
                            >
                              {updating === r.id ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={14} />}
                            </button>
                          )}
                          {r.status === 'potwierdzona' && (
                            <button
                              id={`complete-${r.id}`}
                              className="btn btn-ghost btn-icon"
                              onClick={() => updateStatus(r.id, 'zakonczona')}
                              disabled={updating === r.id}
                              aria-label="Zakończ"
                              title="Zakończ wizytę"
                              style={{ color: 'var(--status-info)' }}
                            >
                              {updating === r.id ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={14} />}
                            </button>
                          )}
                          {r.status !== 'anulowana' && r.status !== 'zakonczona' && (
                            <button
                              id={`cancel-${r.id}`}
                              className="btn btn-ghost btn-icon"
                              onClick={() => updateStatus(r.id, 'anulowana')}
                              disabled={updating === r.id}
                              aria-label="Anuluj"
                              title="Anuluj"
                              style={{ color: 'var(--status-danger)' }}
                            >
                              <XCircle size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* CALENDAR / WEEK VIEW */
        <div className="glass-card" style={{ padding: 'var(--space-4)', overflowX: 'auto' }}>
          <div style={{ minWidth: 900, display: 'flex', flexDirection: 'column' }}>
            {/* Header dni */}
            <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', borderBottom: '1px solid var(--border-primary)', paddingBottom: 'var(--space-3)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', fontWeight: 650, display: 'flex', alignItems: 'center' }}>Godzina</div>
              {daysOfWeek.map((day, i) => {
                const dateStr = day.toISOString().slice(0, 10);
                const isToday = new Date().toISOString().slice(0, 10) === dateStr;
                return (
                  <div key={i} style={{ textAlign: 'center', padding: '0 var(--space-2)' }}>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      color: isToday ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      background: isToday ? 'var(--accent-primary-glow)' : 'transparent',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-full)',
                      display: 'inline-block'
                    }}>
                      {getDayLabel(day)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Siatka godzinowa i kafelki */}
            <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', position: 'relative', height: 780 }}>
              {/* Kolumna godzin */}
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {hours.map(h => (
                  <div key={h} style={{ height: 60, borderBottom: '1px dashed var(--border-primary)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', paddingTop: 4 }}>
                    {h.toString().padStart(2, '0')}:00
                  </div>
                ))}
              </div>

              {/* Kolumny dni (siatka tła) */}
              {daysOfWeek.map((day, colIdx) => {
                const dateStr = day.toISOString().slice(0, 10);
                const dayReservations = getReservationsForDate(dateStr);

                return (
                  <div key={colIdx} style={{ position: 'relative', borderLeft: '1px solid var(--border-primary)', height: '100%' }}>
                    {/* Poziome linie tła */}
                    {hours.map(h => (
                      <div key={h} style={{ height: 60, borderBottom: '1px dashed var(--border-primary)' }} />
                    ))}

                    {/* Kafelki rezerwacji */}
                    {dayReservations.map(r => {
                      const [hStr, mStr] = r.time.split(':');
                      const startHour = parseInt(hStr, 10);
                      const startMin = parseInt(mStr, 10);

                      // Oblicz pozycję w pionie
                      // Siatka zaczyna się o 8:00, 1 godzina = 60px
                      const topPos = (startHour - 8) * 60 + startMin;
                      const heightVal = r.serviceDuration;
                      const sColor = getServiceColor(r.serviceId);

                      // Ograniczenie wyświetlania poza godzinami 8-20
                      if (startHour < 8 || startHour >= 20) return null;

                      return (
                        <div
                          key={r.id}
                          onClick={() => setSelected(r)}
                          style={{
                            position: 'absolute',
                            top: topPos,
                            left: '4%',
                            width: '92%',
                            height: heightVal,
                            background: `linear-gradient(135deg, ${sColor}25, ${sColor}15)`,
                            borderLeft: `4px solid ${sColor}`,
                            borderTop: `1px solid ${sColor}40`,
                            borderRight: `1px solid ${sColor}40`,
                            borderBottom: `1px solid ${sColor}40`,
                            borderRadius: 'var(--radius-md)',
                            padding: '4px 6px',
                            cursor: 'pointer',
                            zIndex: 10,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'transform var(--transition-fast)'
                          }}
                          className="calendar-tile-hover"
                          title={`${r.clientFirstName} ${r.clientLastName} - ${r.serviceName} (${r.time})`}
                        >
                          <div style={{ fontWeight: 700, fontSize: '10px', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {r.serviceName}
                          </div>
                          <div style={{ fontSize: '9px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <User size={8} /> {r.clientFirstName} {r.clientLastName}
                          </div>
                          <div style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2, marginTop: 'auto' }}>
                            <Clock size={8} /> {r.time} ({r.serviceDuration}m)
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Szczegóły rezerwacji"
      >
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)' }}>
              <div className="avatar avatar-lg">{selected.clientFirstName[0]}{selected.clientLastName[0]}</div>
              <div>
                <div style={{ fontWeight: 700 }}>{selected.clientFirstName} {selected.clientLastName}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{selected.clientEmail}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{selected.clientPhone}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <StatusBadge status={selected.status} />
              </div>
            </div>

            {[
              { label: 'Usługa', value: selected.serviceName },
              { label: 'Data', value: formatDate(selected.date) },
              { label: 'Godzina', value: selected.time },
              { label: 'Czas trwania', value: `${selected.serviceDuration} min` },
              { label: 'Kwota', value: formatCurrency(selected.servicePrice) },
              { label: 'ID rezerwacji', value: selected.id },
              ...(selected.notes ? [{ label: 'Uwagi', value: selected.notes }] : []),
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-primary)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>{label}</span>
                <span style={{ fontWeight: 500, fontSize: 'var(--text-sm)', textAlign: 'right' }}>{value}</span>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 'var(--space-3)', paddingTop: 'var(--space-2)' }}>
              <button
                className="btn btn-secondary flex-1"
                onClick={() => { setEditing(selected); setSelected(null); }}
              >
                <Edit size={14} /> Edytuj szczegóły
              </button>

              {selected.status === 'oczekujaca' && (
                <button
                  className="btn btn-primary flex-1"
                  onClick={() => { updateStatus(selected.id, 'potwierdzona'); setSelected(null); }}
                >
                  <CheckCircle size={14} /> Potwierdź
                </button>
              )}
              {selected.status === 'potwierdzona' && (
                <button
                  className="btn btn-primary flex-1"
                  onClick={() => { updateStatus(selected.id, 'zakonczona'); setSelected(null); }}
                >
                  <CheckCircle size={14} /> Zakończ
                </button>
              )}
              {selected.status !== 'anulowana' && selected.status !== 'zakonczona' && (
                <button
                  className="btn btn-danger"
                  onClick={() => { updateStatus(selected.id, 'anulowana'); setSelected(null); }}
                >
                  <XCircle size={14} /> Anuluj
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edytuj rezerwację"
        size="md"
      >
        {editing && (
          <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Imię klienta</label>
                <input
                  type="text"
                  value={editing.clientFirstName}
                  onChange={e => setEditing({ ...editing, clientFirstName: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nazwisko klienta</label>
                <input
                  type="text"
                  value={editing.clientLastName}
                  onChange={e => setEditing({ ...editing, clientLastName: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={editing.clientEmail}
                  onChange={e => setEditing({ ...editing, clientEmail: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Telefon</label>
                <input
                  type="text"
                  value={editing.clientPhone}
                  onChange={e => setEditing({ ...editing, clientPhone: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="divider" style={{ margin: 'var(--space-2) 0' }} />

            <div className="form-group">
              <label className="form-label">Usługa</label>
              <select
                value={editing.serviceId}
                onChange={e => setEditing({ ...editing, serviceId: e.target.value })}
                className="form-input form-select"
                required
              >
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.duration} min) — {formatCurrency(s.price)}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Data</label>
                <input
                  type="date"
                  value={editing.date}
                  onChange={e => setEditing({ ...editing, date: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Godzina</label>
                <input
                  type="time"
                  value={editing.time}
                  onChange={e => setEditing({ ...editing, time: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  value={editing.status}
                  onChange={e => setEditing({ ...editing, status: e.target.value as ReservationStatus })}
                  className="form-input form-select"
                  required
                >
                  <option value="oczekujaca">oczekująca</option>
                  <option value="potwierdzona">potwierdzona</option>
                  <option value="zakonczona">zakończona</option>
                  <option value="anulowana">anulowana</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Uwagi do wizyty</label>
              <textarea
                value={editing.notes}
                onChange={e => setEditing({ ...editing, notes: e.target.value })}
                className="form-input"
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditing(null)}
              >
                Anuluj
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Zapisz zmiany
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
