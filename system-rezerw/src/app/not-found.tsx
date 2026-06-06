'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: 'var(--space-8)',
      textAlign: 'center',
    }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div style={{
          width: 120,
          height: 120,
          background: 'var(--bg-elevated)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-8)',
          color: 'var(--status-warning)',
        }}>
          <AlertCircle size={64} />
        </div>

        <h1 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: 900, lineHeight: 1, marginBottom: 'var(--space-4)' }} className="text-gradient">
          404
        </h1>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          Ups! Strona nie istnieje
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto var(--space-10)', lineHeight: 1.6 }}>
          Wygląda na to, że wybrany adres jest niepoprawny lub strona została przeniesiona. 
          Wróć do bezpiecznej przystani.
        </p>

        <Link href="/" className="btn btn-primary btn-lg">
          <Home size={20} />
          Wróć do strony głównej
        </Link>
      </motion.div>
    </div>
  );
}
