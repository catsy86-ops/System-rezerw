'use client';

// ============================================================
// TOAST COMPONENT
// ============================================================

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { Toast as ToastType } from '@/types';

const ICON_MAP = {
  success: <CheckCircle size={16} color="var(--status-success)" />,
  error: <XCircle size={16} color="var(--status-danger)" />,
  info: <Info size={16} color="var(--status-info)" />,
  warning: <AlertTriangle size={16} color="var(--status-warning)" />,
};

interface ToastItemProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const duration = toast.duration ?? 4500;
    const exitTimer = setTimeout(() => setExiting(true), duration);
    const removeTimer = setTimeout(() => onRemove(toast.id), duration + 200);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.id, toast.duration, onRemove]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => onRemove(toast.id), 200);
  };

  return (
    <div className={`toast toast-${toast.type} ${exiting ? 'exiting' : ''}`} role="alert">
      <div className="toast-icon">{ICON_MAP[toast.type]}</div>
      <div className="flex-1">
        <div className="toast-title">{toast.title}</div>
        {toast.message && <div className="toast-message">{toast.message}</div>}
      </div>
      <button
        onClick={handleClose}
        className="btn btn-ghost btn-icon"
        aria-label="Zamknij powiadomienie"
        style={{ padding: '4px', minWidth: 'auto', minHeight: 'auto', color: 'var(--text-muted)' }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}
