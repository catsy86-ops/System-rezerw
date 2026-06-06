'use client';

// ============================================================
// PANEL LAYOUT (admin)
// ============================================================

import { useState, useEffect } from 'react';
import { Sun, Moon, Target } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    if (savedTheme !== theme) {
      setTheme(savedTheme);
    }
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <div className="page-layout">
      {/* Desktop Sidebar */}
      <Sidebar />

      <div className="page-content">
        {/* Mobile Top Header */}
        <header
          style={{
            display: 'none',
            padding: 'var(--space-3) var(--space-5)',
            borderBottom: '1px solid var(--border-primary)',
            background: 'var(--bg-card)',
            backdropFilter: 'blur(12px)',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
          className="mobile-header"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 28,
              height: 28,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Target size={14} color="#fff" />
            </div>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 800, letterSpacing: '0.02em' }}>
              Nocny Promil
            </span>
          </div>

          <button
            className="btn btn-ghost btn-icon"
            onClick={toggleTheme}
            aria-label="Przełącz motyw"
            style={{ width: 36, height: 36 }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        <main className="page-main" style={{ position: 'relative' }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-header { display: flex !important; }
          .sidebar { display: none !important; }
          .page-content { margin-left: 0 !important; }
          .page-main { 
            padding-bottom: calc(80px + env(safe-area-inset-bottom, 16px)) !important;
            padding-left: var(--space-4) !important;
            padding-right: var(--space-4) !important;
            padding-top: var(--space-6) !important;
          }
        }
        @media (min-width: 769px) {
          .sidebar { transform: translateX(0) !important; }
        }
      `}</style>
    </div>
  );
}
