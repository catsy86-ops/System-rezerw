'use client';

// ============================================================
// PANEL — USŁUGI
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Power, PowerOff, Loader2 } from 'lucide-react';
import { servicesApi } from '@/lib/api';
import { formatCurrency, formatDuration } from '@/lib/formatters';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/ToastProvider';
import { validateService, getFieldError } from '@/lib/validators';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/lib/constants';
import type { Service, ServiceFormData, ServiceCategory } from '@/types';

const DEFAULT_FORM: ServiceFormData = {
  name: '',
  description: '',
  duration: 60,
  price: 100,
  category: 'inne',
  icon: '⭐',
  color: '#10B981',
  active: true,
};

const ICON_OPTIONS = ['✂️', '💈', '🎨', '💅', '🌸', '🧘', '💆', '🌿', '👁️', '✨', '⭐', '💎', '🌺', '🍃', '💐'];
const COLOR_OPTIONS = ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4', '#EF4444', '#22C55E', '#D97706', '#A855F7'];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceFormData>(DEFAULT_FORM);
  const [errors, setErrors] = useState<{ field: string; message: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const fetchServices = useCallback(async () => {
    const data = await servicesApi.getAll();
    setServices(data as unknown as Service[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const openModal = (service?: Service) => {
    if (service) {
      setEditing(service);
      setForm({
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        category: service.category,
        icon: service.icon,
        color: service.color,
        active: service.active,
      });
    } else {
      setEditing(null);
      setForm(DEFAULT_FORM);
    }
    setErrors([]);
    setModalOpen(true);
  };

  const handleSave = async () => {
    const result = validateService(form);
    if (!result.valid) { setErrors(result.errors); return; }

    setSaving(true);
    try {
      if (editing) {
        await servicesApi.update(editing.id, form);
        toast.success('Usługa zaktualizowana', form.name);
      } else {
        await servicesApi.create(form);
        toast.success('Usługa dodana', form.name);
      }
      await fetchServices();
      setModalOpen(false);
    } catch {
      toast.error('Błąd', 'Nie udało się zapisać usługi');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (service: Service) => {
    try {
      await servicesApi.update(service.id, { active: !service.active });
      setServices(prev => prev.map(s => s.id === service.id ? { ...s, active: !s.active } : s));
      toast.info(
        service.active ? 'Usługa wyłączona' : 'Usługa włączona',
        service.name
      );
    } catch {
      toast.error('Błąd', 'Nie udało się zmienić statusu usługi');
    }
  };

  const handleDelete = async (service: Service) => {
    if (!confirm(`Czy na pewno usunąć usługę "${service.name}"?`)) return;
    try {
      await servicesApi.delete(service.id);
      setServices(prev => prev.filter(s => s.id !== service.id));
      toast.success('Usługa usunięta');
    } catch {
      toast.error('Błąd', 'Nie udało się usunąć usługi');
    }
  };

  const f = (field: string) => getFieldError(errors, field);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-1)' }}>Usługi</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Zarządzaj ofertą salonu ({services.length} usług)
          </p>
        </div>
        <button id="add-service-btn" className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={16} /> Dodaj usługę
        </button>
      </div>

      {loading ? (
        <div className="loader-container"><div className="spinner" /></div>
      ) : (
        <div className="grid-auto">
          {services.map(service => (
            <div
              key={service.id}
              className="glass-card"
              style={{
                padding: 'var(--space-5)',
                borderTop: `3px solid ${service.active ? service.color : 'var(--border-primary)'}`,
                opacity: service.active ? 1 : 0.6,
                transition: 'all var(--transition-base)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{service.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{service.name}</div>
                    <Badge variant={service.active ? 'success' : 'neutral'}>
                      {service.active ? 'Aktywna' : 'Nieaktywna'}
                    </Badge>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                  <button
                    id={`toggle-${service.id}`}
                    className="btn btn-ghost btn-icon"
                    onClick={() => handleToggle(service)}
                    title={service.active ? 'Wyłącz' : 'Włącz'}
                    style={{ color: service.active ? 'var(--status-success)' : 'var(--text-muted)' }}
                  >
                    {service.active ? <Power size={14} /> : <PowerOff size={14} />}
                  </button>
                  <button
                    id={`edit-${service.id}`}
                    className="btn btn-ghost btn-icon"
                    onClick={() => openModal(service)}
                    title="Edytuj"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    id={`delete-${service.id}`}
                    className="btn btn-ghost btn-icon"
                    onClick={() => handleDelete(service)}
                    title="Usuń"
                    style={{ color: 'var(--status-danger)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-3)' }}>
                {service.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-primary)' }}>
                <span style={{ fontWeight: 700, color: service.color, fontSize: 'var(--text-sm)' }}>
                  {formatCurrency(service.price)}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  {formatDuration(service.duration)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edytuj usługę' : 'Nowa usługa'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Anuluj
            </button>
            <button
              id="save-service-btn"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {editing ? 'Zapisz zmiany' : 'Dodaj usługę'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="svc-name">Nazwa <span className="required">*</span></label>
            <input
              id="svc-name"
              className={`form-input ${f('name') ? 'error' : ''}`}
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="np. Strzyżenie damskie"
            />
            {f('name') && <span className="form-error">{f('name')}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="svc-desc">Opis <span className="required">*</span></label>
            <textarea
              id="svc-desc"
              className={`form-input ${f('description') ? 'error' : ''}`}
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Krótki opis usługi..."
              rows={2}
            />
            {f('description') && <span className="form-error">{f('description')}</span>}
          </div>

          {/* Duration + Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="svc-duration">Czas (min) <span className="required">*</span></label>
              <input
                id="svc-duration"
                type="number"
                className={`form-input ${f('duration') ? 'error' : ''}`}
                value={form.duration}
                onChange={e => setForm(p => ({ ...p, duration: Number(e.target.value) }))}
                min={5}
                max={480}
                step={5}
              />
              {f('duration') && <span className="form-error">{f('duration')}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="svc-price">Cena (PLN) <span className="required">*</span></label>
              <input
                id="svc-price"
                type="number"
                className={`form-input ${f('price') ? 'error' : ''}`}
                value={form.price}
                onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))}
                min={0}
              />
              {f('price') && <span className="form-error">{f('price')}</span>}
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="svc-category">Kategoria</label>
            <select
              id="svc-category"
              className="form-input form-select"
              value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value as ServiceCategory }))}
            >
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{CATEGORY_ICONS[value]} {label}</option>
              ))}
            </select>
          </div>

          {/* Icon */}
          <div className="form-group">
            <label className="form-label">Ikona</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {ICON_OPTIONS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, icon }))}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-md)',
                    border: form.icon === icon ? '2px solid var(--accent-primary)' : '1px solid var(--border-primary)',
                    background: form.icon === icon ? 'var(--accent-primary-glow)' : 'var(--bg-elevated)',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="form-group">
            <label className="form-label">Kolor akcentu</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {COLOR_OPTIONS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, color }))}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-full)',
                    background: color,
                    border: form.color === color ? '3px solid #fff' : '2px solid transparent',
                    cursor: 'pointer',
                    boxShadow: form.color === color ? `0 0 0 2px ${color}` : 'none',
                    transition: 'all var(--transition-fast)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
