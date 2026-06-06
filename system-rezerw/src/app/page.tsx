'use client';

// ============================================================
// STRONA GŁÓWNA — Nocny Promil (Premium Delivery)
// ============================================================

import Link from 'next/link';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { useRef } from 'react';
import {
  Calendar,
  Clock,
  Star,
  ArrowRight,
  Scissors,
  Heart,
  Target,
  Shield,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Sparkles,
  Zap,
  Coffee,
  Package,
  GlassWater,
} from 'lucide-react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const bentoItem: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const FEATURES = [
  {
    icon: <Sparkles size={28} />,
    title: 'Najwyższa Precyzja',
    description: 'Błyskawiczna dostawa. Nasi kurierzy to mistrzowie logistyki nocnej.',
    size: 'large',
    color: 'var(--accent-primary)',
  },
  {
    icon: <Clock size={24} />,
    title: 'Twój Czas',
    description: 'Zamówienie w mniej niż 60 sekund bez zbędnych kont.',
    size: 'small',
    color: 'var(--accent-secondary)',
  },
  {
    icon: <Shield size={24} />,
    title: 'Dyskrecja',
    description: 'Prywatność i bezpieczeństwo Twojego zamówienia.',
    size: 'small',
    color: '#EC4899',
  },
  {
    icon: <GlassWater size={24} />,
    title: 'Imprezowy Ratunek',
    description: 'Szeroki asortyment alkoholi i przekąsek dostępny od ręki.',
    size: 'medium',
    color: '#06B6D4',
  },
];

const SERVICES_PREVIEW = [
  { icon: '🧊', name: 'Wódka Wyborowa', desc: 'Klasyczna wódka, dostarczana schłodzona.', price: 'od 50 zł', color: '#3B82F6' },
  { icon: '🍺', name: 'Piwo Rzemieślnicze', desc: 'Zestaw wybranych piw z lokalnego browaru.', price: 'od 45 zł', color: '#F59E0B' },
  { icon: '🍷', name: 'Wino Czerwone', desc: 'Wysokiej jakości wino ze szczepu Cabernet.', price: 'od 70 zł', color: '#EC4899' },
  { icon: '🥃', name: 'Whisky Jack Daniels', desc: 'Popularna amerykańska whiskey.', price: 'od 120 zł', color: '#8B5CF6' },
];

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* ── Navbar ── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(10, 15, 26, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-primary)',
          padding: '0 var(--space-8)',
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 15 }}
            style={{
              width: 38,
              height: 38,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
            }}
          >
            <Target size={20} color="#fff" />
          </motion.div>
          <div>
            <div style={{ fontSize: 'var(--text-base)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.08em', lineHeight: 1 }}>
              Nocny Promil
            </div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>
              Całodobowy Dowóz Alkoholu
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/panel" className="btn btn-ghost btn-sm hidden-mobile" style={{ fontWeight: 600 }}>
            Panel Admina
          </Link>
          <Link href="/rezerwacja" className="btn btn-primary btn-sm" style={{ padding: '8px 20px', borderRadius: 'var(--radius-full)' }}>
            Zamów online
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          padding: 'var(--space-20) var(--space-8)',
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Abstract Background Elements */}
        <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
          <div style={{ 
            position: 'absolute', 
            top: '20%', 
            left: '10%', 
            width: '40vw', 
            height: '40vw', 
            background: 'radial-gradient(circle, var(--accent-primary-glow) 0%, transparent 70%)',
            opacity: 0.6,
            filter: 'blur(100px)',
          }} />
          <div style={{ 
            position: 'absolute', 
            bottom: '10%', 
            right: '10%', 
            width: '35vw', 
            height: '35vw', 
            background: 'radial-gradient(circle, var(--accent-secondary-glow) 0%, transparent 70%)',
            opacity: 0.4,
            filter: 'blur(80px)',
          }} />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, maxWidth: 900 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="badge"
            style={{ 
              marginBottom: 'var(--space-6)', 
              background: 'rgba(255,255,255,0.05)', 
              borderColor: 'rgba(255,255,255,0.1)', 
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              color: 'var(--accent-primary)',
              fontWeight: 600,
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.05em',
            }}
          >
            <Sparkles size={12} style={{ marginRight: 6 }} />
            Najszybsza dostawa w Szczecinie
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-balance text-ls-tight"
            style={{
              fontSize: 'clamp(3rem, 8vw, 5.5rem)',
              fontWeight: 900,
              lineHeight: 0.95,
              marginBottom: 'var(--space-8)',
            }}
          >
            Nocny dowóz <br />
            <span className="text-gradient">alkoholu do</span> <br />
            Twoich drzwi.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: 600,
              margin: '0 auto var(--space-12)',
              lineHeight: 1.6,
            }}
          >
            W Nocny Promil dowozimy alkohol przez całą noc. Błyskawiczna dostawa, szeroki asortyment i profesjonalna obsługa. Nie przerywaj imprezy!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6 flex-wrap"
          >
            <Link href="/rezerwacja" className="btn btn-primary btn-lg glow-primary" style={{ borderRadius: 'var(--radius-full)', padding: '18px 40px', fontSize: 'var(--text-base)' }}>
              Złóż zamówienie
              <ArrowRight size={20} style={{ marginLeft: 8 }} />
            </Link>
            <Link href="#uslugi" className="btn btn-secondary btn-lg" style={{ borderRadius: 'var(--radius-full)', padding: '18px 40px', fontSize: 'var(--text-base)' }}>
              Zobacz asortyment
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ position: 'absolute', bottom: 'var(--space-8)', opacity: 0.3 }}
        >
          <div style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, var(--accent-primary), transparent)' }} />
        </motion.div>
      </section>

      {/* ── Bento Grid Features ── */}
      <section style={{ padding: 'var(--space-20) var(--space-8)', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
            <h2 className="text-ls-tight" style={{ fontSize: 'var(--text-4xl)', fontWeight: 900, marginBottom: 'var(--space-4)' }}>
              Dlaczego <span className="text-gradient">Nocny Promil</span>?
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
              Standardy, które nas wyróżniają. Profesjonalizm w każdym calu.
            </p>
          </div>

          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(12, 1fr)', 
              gridAutoRows: 'minmax(180px, auto)',
              gap: 'var(--space-6)',
            }}
          >
            {/* Item 1 - Large */}
            <motion.div
              variants={bentoItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass-card-premium"
              style={{ gridColumn: 'span 8', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <div style={{ color: 'var(--accent-primary)', marginBottom: 'var(--space-4)' }}>
                <Sparkles size={32} />
              </div>
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Szybkość i Precyzja</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '400px' }}>
                Nasz system logistyczny pozwala na optymalizację tras, dzięki czemu dostawa zajmuje zazwyczaj mniej niż 30 minut od złożenia zamówienia.
              </p>
            </motion.div>

            {/* Item 2 - Small */}
            <motion.div
              variants={bentoItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass-card-premium"
              style={{ gridColumn: 'span 4', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'var(--accent-primary-glow)' }}
            >
              <div style={{ color: 'var(--accent-primary)', marginBottom: 'var(--space-4)' }}>
                <Zap size={32} fill="currentColor" />
              </div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>Ekspresowy Koszyk</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 8 }}>Mniej niż 60 sekund.</p>
            </motion.div>

            {/* Item 3 - Small */}
            <motion.div
              variants={bentoItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass-card-premium"
              style={{ gridColumn: 'span 4', padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
            >
              <div style={{ color: '#EC4899', marginBottom: 'var(--space-4)' }}>
                <Shield size={32} />
              </div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>Dyskrecja</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 8 }}>Anonimowe dostawy.</p>
            </motion.div>

            {/* Item 4 - Medium */}
            <motion.div
              variants={bentoItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass-card-premium"
              style={{ gridColumn: 'span 8', padding: 'var(--space-8)', display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}
            >
              <div style={{ 
                width: 100, 
                height: 100, 
                borderRadius: 'var(--radius-xl)', 
                background: 'rgba(6, 182, 212, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#06B6D4',
                flexShrink: 0
              }}>
                <Package size={40} />
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Zawsze pod ręką</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                  Zabrakło trunków w połowie nocy? Nocny Promil dowiezie wszystko, czego potrzebujesz, aby kontynuować zabawę. Najlepszy asortyment w mieście.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Services Section ── */}
      <section id="uslugi" style={{ padding: 'var(--space-20) var(--space-8)', position: 'relative' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-12)', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
            <div>
              <div className="badge badge-success" style={{ marginBottom: 'var(--space-4)', borderRadius: 'var(--radius-full)' }}>Top Wybory</div>
              <h2 className="text-ls-tight" style={{ fontSize: 'var(--text-4xl)', fontWeight: 900 }}>Nasz asortyment</h2>
            </div>
            <Link href="/rezerwacja" className="btn btn-ghost" style={{ fontWeight: 600 }}>
              Pełna lista <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid-auto">
            {SERVICES_PREVIEW.map((service, i) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href="/rezerwacja" style={{ textDecoration: 'none' }}>
                  <div 
                    className="glass-card" 
                    style={{ 
                      padding: 'var(--space-6)', 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderTop: `4px solid ${service.color}`,
                    }}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>{service.icon}</div>
                    <h3 style={{ fontWeight: 800, fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>{service.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.5, marginBottom: 'var(--space-6)' }}>{service.desc}</p>
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: service.color }}>{service.price}</span>
                      <div style={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: '50%', 
                        background: 'var(--bg-elevated)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: service.color
                      }}>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: 'var(--space-16) var(--space-8)', borderTop: '1px solid var(--border-primary)', borderBottom: '1px solid var(--border-primary)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-8)', textAlign: 'center' }}>
          {[
            { label: 'Zadowolonych imprezowiczów', value: '5,000+' },
            { label: 'Średni czas dostawy', value: '25 min' },
            { label: 'Lat na rynku', value: '5' },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, color: 'var(--accent-primary)', marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{ padding: 'var(--space-20) var(--space-8)' }}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          style={{ 
            maxWidth: 1000, 
            margin: '0 auto', 
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-16) var(--space-8)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'var(--accent-primary-glow)', filter: 'blur(100px)', opacity: 0.5 }} />
          
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 'var(--space-4)' }}>Gotowy na <span className="text-gradient">Zamówienie</span>?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', maxWidth: 600, margin: '0 auto var(--space-10)' }}>
            Złóż zamówienie online i ciesz się błyskawiczną dostawą. Twój alkohol w najlepszych rękach kurierów w Szczecinie.
          </p>
          <Link href="/rezerwacja" className="btn btn-primary btn-lg glow-primary" style={{ borderRadius: 'var(--radius-full)', padding: '20px 50px' }}>
            Zamów teraz
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: '1px solid var(--border-primary)',
          padding: 'var(--space-12) var(--space-8)',
          background: 'var(--bg-secondary)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--container-max)',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-12)',
          }}
        >
          <div style={{ gridColumn: 'span 2' }}>
            <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-6)' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Target size={14} color="#fff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: 'var(--text-lg)', letterSpacing: '0.05em' }}>Nocny Promil</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.8, maxWidth: 320 }}>
              Najszybszy dowóz alkoholu w Szczecinie. Precyzja i jakość, której szukasz. Działamy całą noc, abyś Ty nie musiał wychodzić.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-6)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Kontakt
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {[
                { icon: <Phone size={14} />, text: '+48 91 123 45 67' },
                { icon: <Mail size={14} />, text: 'kontakt@nocnypromil.pl' },
                { icon: <MapPin size={14} />, text: 'ul. Łucznicza 43, Szczecin' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--accent-primary)' }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-6)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Dostępność
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              <div className="flex justify-between">
                <span>Poniedziałek – Czwartek</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>20:00 – 04:00</span>
              </div>
              <div className="flex justify-between">
                <span>Piątek – Sobota</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>20:00 – 06:00</span>
              </div>
              <div className="flex justify-between">
                <span>Niedziela</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>20:00 – 02:00</span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 'var(--space-16)',
            paddingTop: 'var(--space-8)',
            borderTop: '1px solid var(--border-primary)',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: 'var(--text-xs)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>© 2026 Nocny Promil. Wszelkie prawa zastrzeżone.</div>
            <div className="flex justify-center gap-6">
              <Link href="/anuluj" style={{ color: 'var(--status-danger)', fontWeight: 600 }}>
                Zarządzaj zamówieniem
              </Link>
              <Link href="/panel" style={{ color: 'var(--text-muted)' }}>
                Dostęp dla personelu
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @media (max-width: 768px) {
          .mobile-header { height: auto !important; padding: var(--space-4) !important; }
        }
        :root {
          --mouse-x: 50%;
          --mouse-y: 50%;
        }
      `}</style>
    </div>
  );
}
