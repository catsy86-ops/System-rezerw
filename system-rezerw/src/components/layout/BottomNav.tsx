'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/panel', label: 'Panel', Icon: LayoutDashboard, exact: true },
  { href: '/panel/rezerwacje', label: 'Wizyty', Icon: Calendar, exact: false },
  { href: '/panel/uslugi', label: 'Usługi', Icon: Scissors, exact: false },
  { href: '/panel/klienci', label: 'Klienci', Icon: Users, exact: false },
  { href: '/panel/ustawienia', label: 'Opcje', Icon: Settings, exact: false },
];

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav
      className="hidden-desktop"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'var(--bg-card)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid var(--border-primary)',
        paddingBottom: 'env(safe-area-inset-bottom, 12px)',
        paddingTop: 'var(--space-2)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
      }}
    >
      {NAV_ITEMS.map(({ href, label, Icon, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: 'var(--space-2) var(--space-3)',
              color: active ? 'var(--accent-primary)' : 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              position: 'relative',
              flex: 1,
            }}
          >
            <motion.div
              animate={active ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            </motion.div>
            
            <span style={{ 
              fontSize: '10px', 
              fontWeight: active ? 700 : 500,
              letterSpacing: '0.02em'
            }}>
              {label}
            </span>

            {active && (
              <motion.div
                layoutId="bottom-nav-dot"
                style={{
                  position: 'absolute',
                  top: 0,
                  width: '12px',
                  height: '2px',
                  background: 'var(--accent-primary)',
                  borderRadius: '2px',
                  boxShadow: '0 0 10px var(--accent-primary-glow)',
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
