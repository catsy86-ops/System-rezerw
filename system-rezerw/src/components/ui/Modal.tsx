'use client';

// ============================================================
// MODAL COMPONENT
// ============================================================

import { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const maxWidths = { sm: '400px', md: '560px', lg: '720px' };

  return (
    <AnimatePresence>
      {open && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
          />
          <motion.div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
            style={{ 
              maxWidth: maxWidths[size],
              background: 'var(--bg-card)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid var(--border-primary)',
              position: 'relative',
              zIndex: 1001,
              width: '100%',
              margin: 'auto 16px', // Default for desktop
            }}
          >
            {/* Grab indicator for mobile bottom sheets */}
            <div className="hidden-desktop" style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px' }}>
              <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'var(--border-primary)' }} />
            </div>

            {title && (
              <div className="modal-header">
                <h2 id="modal-title" className="text-lg font-semibold text-primary">{title}</h2>
                <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Zamknij">
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </motion.div>
          <style jsx>{`
            @media (max-width: 480px) {
              .modal {
                margin: 0 !important;
                border-radius: var(--radius-2xl) var(--radius-2xl) 0 0 !important;
              }
            }
            @media (min-width: 481px) {
              .modal {
                margin: auto !important;
                border-radius: var(--radius-2xl) !important;
                transform: translateY(0) !important; /* Reset spring for desktop if needed */
              }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
}
