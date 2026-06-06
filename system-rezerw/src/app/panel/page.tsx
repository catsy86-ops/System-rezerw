'use client';

// ============================================================
// PANEL — DASHBOARD
// ============================================================

import { useState, useEffect } from 'react';
import {
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Scissors,
} from 'lucide-react';
import { statsApi } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { StatusBadge } from '@/components/ui/Badge';
import { DAYS_SHORT_PL } from '@/lib/constants';
import { Skeleton } from '@/components/ui/Skeleton';
import type { DashboardStats } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsApi.getDashboard().then(data => {
      setStats(data as unknown as DashboardStats);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton width="180px" height="32px" />
          <Skeleton width="240px" height="18px" />
        </div>
        <div className="grid-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Skeleton width="40px" height="40px" borderRadius="var(--radius-lg)" />
              <Skeleton width="60%" height="24px" />
              <Skeleton width="40%" height="14px" />
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
          <div className="glass-card" style={{ padding: 'var(--space-6)', height: 260 }}>
            <Skeleton width="100%" height="100%" />
          </div>
          <div className="glass-card" style={{ padding: 'var(--space-6)', height: 260 }}>
            <Skeleton width="100%" height="100%" />
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: "Wizyty dziś",
      value: stats.todayBookings,
      icon: <Calendar size={20} />,
      color: '#10B981',
      sub: 'zaplanowane',
    },
    {
      label: "W tym tygodniu",
      value: stats.weekBookings,
      icon: <TrendingUp size={20} />,
      color: '#6366F1',
      sub: 'rezerwacji',
    },
    {
      label: "Przychód miesiąc",
      value: formatCurrency(stats.monthRevenue),
      icon: <DollarSign size={20} />,
      color: '#F59E0B',
      sub: 'zrealizowane',
    },
    {
      label: "Nowi klienci",
      value: stats.newClients,
      icon: <Users size={20} />,
      color: '#EC4899',
      sub: 'w tym miesiącu',
    },
  ];

  const maxRevenue = Math.max(...stats.revenueByDay.map(d => d.revenue), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-1)' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          Przegląd działalności salonu
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-4">
        {statCards.map(({ label, value, icon, color, sub }) => (
          <div
            key={label}
            className="glass-card"
            style={{
              padding: 'var(--space-5)',
              borderLeft: `3px solid ${color}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 80,
                height: 80,
                background: `radial-gradient(circle, ${color}12 0%, transparent 70%)`,
                borderRadius: '50%',
                transform: 'translate(20px, -20px)',
              }}
            />
            <div
              style={{
                width: 40,
                height: 40,
                background: `${color}15`,
                border: `1px solid ${color}30`,
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color,
                marginBottom: 'var(--space-3)',
              }}
            >
              {icon}
            </div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              {value}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
              {label}
            </div>
            <div style={{ fontSize: '10px', color, marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* Revenue Chart */}
        <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: 'rgba(16,185,129,0.1)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
              }}
            >
              <BarChart3 size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Przychód — 7 dni</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Tylko zakończone wizyty</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140, padding: '0 var(--space-2)' }}>
            {stats.revenueByDay.map(({ date, revenue }) => {
              const pct = (revenue / maxRevenue) * 100;
              const dayIdx = new Date(date + 'T00:00:00').getDay();
              const dayLabel = DAYS_SHORT_PL[dayIdx];
              return (
                <div
                  key={date}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}
                >
                  <div
                    title={formatCurrency(revenue)}
                    style={{
                      width: '100%',
                      height: `${Math.max(pct, 4)}%`,
                      background: revenue > 0
                        ? 'linear-gradient(180deg, var(--accent-primary), var(--accent-primary-dark))'
                        : 'var(--bg-elevated)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.6s ease',
                      border: revenue === 0 ? '1px solid var(--border-primary)' : 'none',
                      cursor: revenue > 0 ? 'default' : 'default',
                      position: 'relative',
                    }}
                  >
                    {revenue > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 4px)',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '9px',
                          color: 'var(--accent-primary)',
                          whiteSpace: 'nowrap',
                          fontWeight: 600,
                        }}
                      >
                        {revenue} zł
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{dayLabel}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Services */}
        <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: 'rgba(99,102,241,0.1)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-secondary)',
              }}
            >
              <Scissors size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Popularne usługi</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Top 5 rezerwacji</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {stats.popularServices.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center', padding: 'var(--space-8)' }}>
                Brak danych
              </div>
            )}
            {stats.popularServices.map(({ service, count }, i) => {
              const maxCount = stats.popularServices[0]?.count || 1;
              const pct = (count / maxCount) * 100;
              return (
                <div key={service.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      width: 16,
                      textAlign: 'right',
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{service.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {service.name}
                    </div>
                    <div
                      style={{
                        height: 4,
                        background: 'var(--bg-elevated)',
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: service.color,
                          borderRadius: 2,
                          transition: 'width 0.6s ease',
                        }}
                      />
                    </div>
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', flexShrink: 0 }}>
                    {count}×
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-5) var(--space-6)', borderBottom: '1px solid var(--border-primary)' }}>
          <h2 style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>Ostatnie rezerwacje</h2>
        </div>
        <div className="table-container" style={{ borderRadius: 0, border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Klient</th>
                <th>Usługa</th>
                <th>Data</th>
                <th>Godzina</th>
                <th>Kwota</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentReservations.map(r => (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <div
                        className="avatar"
                        style={{
                          background: `linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))`,
                        }}
                      >
                        {r.clientFirstName[0]}{r.clientLastName[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>
                          {r.clientFirstName} {r.clientLastName}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                          {r.clientEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{r.serviceName}</td>
                  <td style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    {formatDate(r.date)}
                  </td>
                  <td style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{r.time}</td>
                  <td style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--accent-primary)' }}>
                    {formatCurrency(r.servicePrice)}
                  </td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid-4">
        {[
          { label: 'Łącznie', value: stats.totalBookings, icon: <Calendar size={16} />, color: 'var(--text-secondary)' },
          { label: 'Potwierdzone', value: stats.confirmedBookings, icon: <CheckCircle size={16} />, color: 'var(--status-success)' },
          { label: 'Zakończone', value: stats.completedBookings, icon: <Clock size={16} />, color: 'var(--status-info)' },
          { label: 'Anulowane', value: stats.cancelledBookings, icon: <XCircle size={16} />, color: 'var(--status-danger)' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="glass-card" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-lg)',
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color,
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
