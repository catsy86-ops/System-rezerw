'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div className="empty-state-icon" style={{ 
          width: 80, 
          height: 80, 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-sm)',
          color: 'var(--accent-primary)'
        }}>
          {icon}
        </div>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', maxWidth: 300, marginBottom: 'var(--space-6)' }}>
          {description}
        </p>
        {action}
      </motion.div>
    </div>
  );
}
