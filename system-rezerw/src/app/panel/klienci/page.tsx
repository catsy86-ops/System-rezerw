'use client';

// ============================================================
// PANEL — KLIENCI
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { Search, User, Mail, Phone, Calendar, DollarSign, History } from 'lucide-react';
import { clientsApi, reservationsApi } from '@/lib/api';
import { formatCurrency, formatDate, getInitials } from '@/lib/formatters';
import { Modal } from '@/components/ui/Modal';
import type { Client } from '@/types';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Stany dla modalu historii
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientReservations, setClientReservations] = useState<any[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(false);

  const handleOpenHistory = async (client: Client) => {
    setSelectedClient(client);
    setLoadingReservations(true);
    try {
      const data = await reservationsApi.getAll({ search: client.email });
      const filtered = data.filter(r => r.clientEmail.toLowerCase() === client.email.toLowerCase());
      setClientReservations(filtered);
    } catch {
      setClientReservations([]);
    } finally {
      setLoadingReservations(false);
    }
  };

  const fetchClients = useCallback(async () => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    const data = await clientsApi.getAll(params);
    setClients(data as unknown as Client[]);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchClients, 300);
    return () => clearTimeout(t);
  }, [fetchClients]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-1)' }}>Klienci</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          Baza klientów ({clients.length} osób)
        </p>
      </div>

      {/* Search */}
      <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
        <div className="search-wrapper" style={{ maxWidth: 400 }}>
          <Search size={14} className="search-icon" />
          <input
            id="client-search"
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Szukaj klienta..."
            className="form-input"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div className="loader-container"><div className="spinner" /></div>
        ) : clients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <User size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p>Brak klientów</p>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Klient</th>
                  <th>Kontakt</th>
                  <th>Dołączył</th>
                  <th>Rezerwacji</th>
                  <th>Wydał łącznie</th>
                  <th>Notatki</th>
                  <th style={{ textAlign: 'right' }}>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div
                          className="avatar"
                          style={{
                            background: `linear-gradient(135deg, hsl(${(c.firstName.charCodeAt(0) * 15) % 360}deg 60% 50%), hsl(${(c.lastName.charCodeAt(0) * 20) % 360}deg 70% 40%))`,
                          }}
                        >
                          {getInitials(c.firstName, c.lastName)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                            {c.firstName} {c.lastName}
                          </div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Mail size={10} /> {c.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                        <Phone size={12} /> {c.phone}
                      </div>
                    </td>
                    <td style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                      {formatDate(c.createdAt.slice(0, 10))}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                        <Calendar size={12} style={{ color: 'var(--accent-primary)' }} />
                        <span style={{ fontWeight: 600 }}>{c.totalBookings}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                        {formatCurrency(c.totalSpent)}
                      </div>
                    </td>
                    <td style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', maxWidth: 160 }}>
                      <span
                        style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                        title={c.notes}
                      >
                        {c.notes || '—'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenHistory(c)}
                        className="btn btn-secondary btn-icon"
                        title="Pokaż historię rezerwacji"
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <History size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedClient && (
        <Modal
          open={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          title={`Historia wizyt: ${selectedClient.firstName} ${selectedClient.lastName}`}
          size="lg"
          footer={
            <button className="btn btn-secondary" onClick={() => setSelectedClient(null)}>
              Zamknij
            </button>
          }
        >
          {loadingReservations ? (
            <div className="loader-container"><div className="spinner" /></div>
          ) : clientReservations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>
              Ten klient nie posiada jeszcze żadnych rezerwacji.
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Usługa</th>
                    <th>Data i godzina</th>
                    <th>Cena</th>
                    <th>Czas trwania</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {clientReservations.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{r.serviceName}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)' }}>
                          <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
                          {formatDate(r.date)} {r.time}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: 'var(--text-sm)' }}>
                        {formatCurrency(r.servicePrice)}
                      </td>
                      <td style={{ fontSize: 'var(--text-sm)' }}>
                        {r.serviceDuration} min
                      </td>
                      <td>
                        <span className={`badge badge-${
                          r.status === 'potwierdzona' ? 'success' :
                          r.status === 'zakonczona' ? 'info' :
                          r.status === 'anulowana' ? 'danger' : 'warning'
                        }`}>
                          {r.status === 'oczekujaca' ? 'oczekująca' : r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
