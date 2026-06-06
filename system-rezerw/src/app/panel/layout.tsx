'use client';

// ============================================================
// PANEL LAYOUT (admin)
// ============================================================

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="page-layout">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="page-content">
        {/* Mobile Header */}
        <header
          style={{
            display: 'none',
            padding: 'var(--space-4)',
            borderBottom: '1px solid var(--border-primary)',
            background: 'var(--bg-secondary)',
            alignItems: 'center',
            gap: 'var(--space-3)',
          }}
          className="mobile-header"
        >
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setSidebarOpen(true)}
            aria-label="Otwórz menu"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-primary">naŁuczniczej</span>
        </header>

        <main className="page-main page-enter">
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-header { display: flex !important; }
          .sidebar { width: 260px !important; }
        }
        @media (min-width: 769px) {
          .sidebar { transform: translateX(0) !important; }
        }
      `}</style>
    </div>
  );
}
