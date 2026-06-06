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
        background: 'rgba(15, 22, 41, 0.85)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        borderTop: '1px solid var(--border-primary)',
        paddingBottom: 'env(safe-area-inset-bottom, 14px)',
        paddingTop: '10px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
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
              padding: '4px 0',
              color: active ? 'var(--accent-primary)' : 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              position: 'relative',
              flex: 1,
            }}
          >
            <motion.div
              animate={active ? { 
                scale: 1.2, 
                y: -4,
                filter: 'drop-shadow(0 0 8px var(--accent-primary-glow))' 
              } : { 
                scale: 1, 
                y: 0,
                filter: 'drop-shadow(0 0 0px transparent)'
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            </motion.div>
            
            <span style={{ 
              fontSize: '10px', 
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              opacity: active ? 1 : 0.7,
              transition: 'opacity 0.3s ease'
            }}>
              {label}
            </span>

            {active && (
              <motion.div
                layoutId="bottom-nav-active-pill"
                style={{
                  position: 'absolute',
                  top: -10,
                  width: '24px',
                  height: '3px',
                  background: 'var(--accent-primary)',
                  borderRadius: '0 0 4px 4px',
                  boxShadow: '0 2px 10px var(--accent-primary-glow)',
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
