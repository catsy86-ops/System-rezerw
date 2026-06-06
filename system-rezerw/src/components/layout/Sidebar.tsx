'use client';

// ============================================================
// SIDEBAR NAVIGATION
// ============================================================

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  Settings,
  X,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/panel', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { href: '/panel/rezerwacje', label: 'Rezerwacje', Icon: Calendar, exact: false },
  { href: '/panel/uslugi', label: 'Usługi', Icon: Scissors, exact: false },
  { href: '/panel/klienci', label: 'Klienci', Icon: Users, exact: false },
  { href: '/panel/ustawienia', label: 'Ustawienia', Icon: Settings, exact: false },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Mobile overlay */}
      {open && onClose && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 150,
          }}
          className="hidden-desktop"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Nawigacja główna">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Sparkles size={18} color="#fff" />
          </div>
          <div>
            <div className="text-sm font-bold text-primary">System Rezerw</div>
            <div className="text-xs text-muted">Panel zarządzania</div>
          </div>
          {onClose && (
            <button
              className="btn btn-ghost btn-icon"
              onClick={onClose}
              aria-label="Zamknij menu"
              style={{ marginLeft: 'auto' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" role="navigation">
          {NAV_ITEMS.map(({ href, label, Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`sidebar-nav-item ${isActive(href, exact) ? 'active' : ''}`}
              onClick={onClose}
              aria-current={isActive(href, exact) ? 'page' : undefined}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <button
            onClick={toggleTheme}
            className="sidebar-nav-item"
            style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === 'dark' ? 'Tryb jasny' : 'Tryb ciemny'}</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-muted"
            style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', transition: 'color var(--transition-base)', display: 'inline-flex' }}
          >
            <span>← Strona główna</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
