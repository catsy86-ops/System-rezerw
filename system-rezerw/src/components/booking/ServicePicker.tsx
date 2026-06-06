'use client';

// ============================================================
// KROK 1 — Wybór Usługi (Elite Design)
// ============================================================

import { useState, useEffect } from 'react';
import { Clock, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { servicesApi } from '@/lib/api';
import { formatCurrency, formatDuration } from '@/lib/formatters';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/constants';
import { ServiceGridSkeleton } from '@/components/ui/Skeleton';
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
    return <ServiceGridSkeleton />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Category Filter */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-3)',
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: '4px',
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-full)',
          width: 'fit-content',
          margin: '0 auto',
          border: '1px solid var(--border-primary)',
        }}
      >
        {categories.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn btn-sm`}
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '6px 16px',
                background: isActive ? 'var(--accent-primary)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                boxShadow: isActive ? '0 4px 12px var(--accent-primary-glow)' : 'none',
                fontWeight: isActive ? 700 : 500,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {cat === 'all' ? 'Wszystkie' : CATEGORY_LABELS[cat] || cat}
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid-auto">
        {filtered.map((service, i) => {
          const isSelected = selectedId === service.id;
          return (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelect(service)}
              style={{
                textAlign: 'left',
                width: '100%',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer'
              }}
              aria-pressed={isSelected}
            >
              <div
                className={`glass-card-premium ${isSelected ? 'selected' : ''}`}
                style={{
                  padding: 'var(--space-6)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderTop: `4px solid ${isSelected ? 'var(--accent-primary)' : service.color + '40'}`,
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isSelected ? '0 20px 40px -10px var(--accent-primary-glow)' : 'var(--shadow-bento)'
                }}
              >
                {/* Icon & Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                  <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>{service.icon}</div>
                  {isSelected && (
                    <div style={{ 
                      background: 'var(--accent-primary)', 
                      color: '#fff', 
                      borderRadius: '50%', 
                      width: 24, 
                      height: 24, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <Sparkles size={14} fill="currentColor" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 'var(--text-lg)', marginBottom: 'var(--space-1)', color: 'var(--text-primary)' }}>
                    {service.name}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                    {service.description}
                  </div>
                </div>

                {/* Price + Duration */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 'var(--space-4)',
                    borderTop: '1px solid var(--border-primary)',
                    marginTop: 'var(--space-6)',
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--space-1)', 
                    color: isSelected ? 'var(--accent-primary)' : service.color, 
                    fontWeight: 800, 
                    fontSize: 'var(--text-base)' 
                  }}>
                    {formatCurrency(service.price)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                    <Clock size={14} />
                    {formatDuration(service.duration)}
                  </div>
                </div>

                {/* Selection Overlay for non-selected */}
                {!isSelected && (
                  <div className="hover-cta" style={{ 
                    marginTop: 'var(--space-4)', 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    color: service.color,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    opacity: 0.6
                  }}>
                    Wybierz usługę <ChevronRight size={12} />
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
