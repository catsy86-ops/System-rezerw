'use client';

// ============================================================
// KROK 1 — Wybór Usługi
// ============================================================

import { useState, useEffect } from 'react';
import { Clock, DollarSign, Loader2 } from 'lucide-react';
import { servicesApi } from '@/lib/api';
import { formatCurrency, formatDuration } from '@/lib/formatters';
import { CATEGORY_LABELS } from '@/lib/constants';
import type { Service, ServiceCategory } from '@/types';

interface ServicePickerProps {
  onSelect: (service: Service) => void;
  selectedId: string;
}

export function ServicePicker({ onSelect, selectedId }: ServicePickerProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all');

  useEffect(() => {
    servicesApi.getAll().then(data => {
      setServices((data as unknown as Service[]).filter((s: Service) => s.active));
      setLoading(false);
    });
  }, []);

  const categories = ['all', ...Array.from(new Set(services.map(s => s.category)))] as (ServiceCategory | 'all')[];

  const filtered = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner" />
        <span className="text-muted text-sm">Ładowanie usług...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Category Filter */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          flexWrap: 'wrap',
          marginBottom: 'var(--space-6)',
          justifyContent: 'center',
        }}
      >
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            id={`category-${cat}`}
          >
            {cat === 'all' ? 'Wszystkie' : CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid-auto">
        {filtered.map(service => (
          <button
            key={service.id}
            id={`service-${service.id}`}
            onClick={() => onSelect(service)}
            style={{
              textAlign: 'left',
              width: '100%',
              background: 'none',
              border: 'none',
              padding: 0,
            }}
            aria-pressed={selectedId === service.id}
          >
            <div
              className={`glass-card service-card ${selectedId === service.id ? 'selected' : ''}`}
              style={{
                '--accent': service.color,
                borderTop: `3px solid ${service.color}40`,
              } as React.CSSProperties}
            >
              {/* Icon */}
              <div style={{ fontSize: '2.2rem', lineHeight: 1 }}>{service.icon}</div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>
                  {service.name}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', lineHeight: 1.5 }}>
                  {service.description}
                </div>
              </div>

              {/* Price + Duration */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 'var(--space-3)',
                  borderTop: `1px solid ${service.color}20`,
                  marginTop: 'var(--space-2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: service.color, fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                  {formatCurrency(service.price)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                  <Clock size={12} />
                  {formatDuration(service.duration)}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
