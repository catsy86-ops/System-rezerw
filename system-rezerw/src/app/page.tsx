'use client';

// ============================================================
// STRONA GŁÓWNA — uFisza (Premium Branding)
// ============================================================

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
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
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const bentoItem = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

const FEATURES = [
  {
    icon: <Sparkles size={28} />,
    title: 'Najwyższa Precyzja',
    description: 'Każdy detal ma znaczenie. Nasi styliści to mistrzowie rzemiosła fryzjerskiego.',
    size: 'large',
    color: 'var(--accent-primary)',
  },
  {
    icon: <Clock size={24} />,
    title: 'Twój Czas',
    description: 'Błyskawiczna rezerwacja bez zbędnych kont.',
    size: 'small',
    color: 'var(--accent-secondary)',
  },
  {
    icon: <Shield size={24} />,
    title: 'Bezpieczeństwo',
    description: 'Higiena i sterylność na poziomie medycznym.',
    size: 'small',
    color: '#EC4899',
  },
  {
    icon: <Coffee size={24} />,
    title: 'Strefa Relaksu',
    description: 'Najlepsza kawa i atmosfera, która pozwoli Ci odetchnąć od codzienności.',
    size: 'medium',
    color: '#06B6D4',
  },
];

const SERVICES_PREVIEW = [
  { icon: '✂️', name: 'Strzyżenie Damskie', desc: 'Personalizowane formy, które podkreślają Twoją urodę.', price: 'od 120 zł', color: '#10B981' },
  { icon: '💈', name: 'Strzyżenie Męskie', desc: 'Klasyka i nowoczesność w perfekcyjnym wydaniu.', price: 'od 60 zł', color: '#3B82F6' },
  { icon: '🎨', name: 'Koloryzacja Premium', desc: 'Luksusowe pigmenty i techniki rozjaśniania.', price: 'od 250 zł', color: '#F59E0B' },
  { icon: '✨', name: 'Stylizacja', desc: 'Na wielkie wyjścia i codzienne okazje.', price: 'od 100 zł', color: '#8B5CF6' },
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
              uFisza
            </div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>
              Elite Hair Design
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/panel" className="btn btn-ghost btn-sm hidden-mobile" style={{ fontWeight: 600 }}>
            Panel Admina
          </Link>
          <Link href="/rezerwacja" className="btn btn-primary btn-sm" style={{ padding: '8px 20px', borderRadius: 'var(--radius-full)' }}>
            Rezerwuj wizytę
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
            Odkryj nową definicję piękna w Szczecinie
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
            Kunszt fryzjerski <br />
            <span className="text-gradient">na najwyższym</span> <br />
            poziomie.
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
            W uFisza łączymy pasję z perfekcją. Tworzymy stylizacje, które nie tylko zachwycają, ale też wyrażają Twoją osobowość. 
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6 flex-wrap"
          >
            <Link href="/rezerwacja" className="btn btn-primary btn-lg glow-primary" style={{ borderRadius: 'var(--radius-full)', padding: '18px 40px', fontSize: 'var(--text-base)' }}>
              Umów wizytę teraz
              <ArrowRight size={20} style={{ marginLeft: 8 }} />
            </Link>
            <Link href="#uslugi" className="btn btn-secondary btn-lg" style={{ borderRadius: 'var(--radius-full)', padding: '18px 40px', fontSize: 'var(--text-base)' }}>
              Zobacz ofertę
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
              Dlaczego <span className="text-gradient">uFisza</span>?
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
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Mistrzowska Precyzja</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '400px' }}>
                Nasz zespół składa się wyłącznie z doświadczonych stylistów, którzy regularnie podnoszą swoje kwalifikacje na międzynarodowych szkoleniach.
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
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>Błyskawiczna Rezerwacja</h3>
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
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>Bezpieczeństwo</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 8 }}>Pełna sterylność narzędzi.</p>
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
                <Coffee size={40} />
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Czas dla Ciebie</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                  Zatrzymaj się na moment. W uFisza dbamy nie tylko o Twoje włosy, ale i o Twoje samopoczucie. Najlepsza kawa w mieście czeka na Ciebie.
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
              <div className="badge badge-success" style={{ marginBottom: 'var(--space-4)', borderRadius: 'var(--radius-full)' }}>Nasze Specjalności</div>
              <h2 className="text-ls-tight" style={{ fontSize: 'var(--text-4xl)', fontWeight: 900 }}>Wybrane usługi</h2>
            </div>
            <Link href="/rezerwacja" className="btn btn-ghost" style={{ fontWeight: 600 }}>
              Pełny cennik <ChevronRight size={16} />
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
            { label: 'Zadowolonych klientów', value: '1,200+' },
            { label: 'Średnia ocena', value: '4.9/5' },
            { label: 'Lat doświadczenia', value: '8' },
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
          
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 'var(--space-4)' }}>Gotowy na <span className="text-gradient">uFisza Look</span>?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', maxWidth: 600, margin: '0 auto var(--space-10)' }}>
            Zarezerwuj swój termin online i ciesz się wyjątkową usługą. Twoje włosy w najlepszych rękach w Szczecinie.
          </p>
          <Link href="/rezerwacja" className="btn btn-primary btn-lg glow-primary" style={{ borderRadius: 'var(--radius-full)', padding: '20px 50px' }}>
            Zarezerwuj teraz wizytę
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
              <span style={{ fontWeight: 800, fontSize: 'var(--text-lg)', letterSpacing: '0.05em' }}>uFisza</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.8, maxWidth: 320 }}>
              Ekskluzywne usługi fryzjerskie. Precyzja i jakość, której szukasz. Najnowocześniejszy salon w sercu Szczecina.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-6)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Lokalizacja
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {[
                { icon: <Phone size={14} />, text: '+48 91 123 45 67' },
                { icon: <Mail size={14} />, text: 'kontakt@ufisza.pl' },
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
                <span>Poniedziałek – Piątek</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>08:00 – 20:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sobota</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>09:00 – 18:00</span>
              </div>
              <div className="flex justify-between">
                <span>Niedziela</span>
                <span style={{ color: 'var(--status-danger)', fontWeight: 600 }}>Nieczynne</span>
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
            <div>© 2026 uFisza. Wszelkie prawa zastrzeżone.</div>
            <div className="flex justify-center gap-6">
              <Link href="/anuluj" style={{ color: 'var(--status-danger)', fontWeight: 600 }}>
                Zarządzaj rezerwacją
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
