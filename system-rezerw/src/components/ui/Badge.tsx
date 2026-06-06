// ============================================================
// BADGE COMPONENT
// ============================================================

import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants';
import type { ReservationStatus } from '@/types';

interface StatusBadgeProps {
  status: ReservationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = STATUS_COLORS[status] || 'neutral';
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`badge badge-${color}`}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'currentColor',
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}
