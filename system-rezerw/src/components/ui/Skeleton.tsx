'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({ width = '100%', height = '20px', borderRadius = 'var(--radius-md)', className = '' }: SkeletonProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius,
        background: 'rgba(255, 255, 255, 0.03)',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.02)',
      }}
    >
      <motion.div
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: [0.4, 0, 0.6, 1],
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
          skewX: -20,
        }}
      />
    </div>
  );
}

export function SkeletonCircle({ size = '40px', className = '' }: { size?: string; className?: string }) {
  return <Skeleton width={size} height={size} borderRadius="50%" className={className} />;
}

export function ServiceGridSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="glass-card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <SkeletonCircle size="48px" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Skeleton width="60%" height="20px" />
            <Skeleton width="90%" height="14px" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
            <Skeleton width="80px" height="16px" />
            <Skeleton width="60px" height="16px" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-8)' }}>
      <div>
        <Skeleton width="150px" height="20px" className="mb-4" />
        <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <SkeletonCircle size="30px" />
            <Skeleton width="100px" height="20px" />
            <SkeletonCircle size="30px" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} width="100%" height="40px" borderRadius="var(--radius-lg)" />
            ))}
          </div>
        </div>
      </div>
      <div>
        <Skeleton width="150px" height="20px" className="mb-4" />
        <div className="glass-card" style={{ padding: 'var(--space-5)' }}>
          <Skeleton width="120px" height="18px" className="mb-4" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} width="100%" height="40px" borderRadius="var(--radius-md)" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
