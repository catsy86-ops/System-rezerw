// ============================================================
// STRONA GŁÓWNA — Landing Page
// ============================================================

import Link from 'next/link';
import {
  Calendar,
  Clock,
  Star,
  ArrowRight,
  Scissors,
  Heart,
  Sparkles,
  Shield,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Rezerw — Rezerwacja Wizyt Online',
  description: 'Zarezerwuj wizytę w naszym salonie online. Fryzjer, kosmetyczka, masaż i więcej. Szybko, wygodnie, bez rejestracji.',
};

const FEATURES = [
  {
    icon: <Calendar size={24} />,
    title: 'Łatwa rezerwacja',
    description: 'Zarezerwuj wizytę w kilka kliknięć, bez rejestracji i zbędnych formalności.',
    color: '#10B981',
  },
  {
    icon: <Clock size={24} />,
    title: 'Wybór terminu',
    description: 'Wybierz dogodną datę i godzinę z dostępnych slotów w kalendarzu.',
    color: '#6366F1',
  },
  {
    icon: <Shield size={24} />,
    title: 'Potwierdzenie',
    description: 'Otrzymaj potwierdzenie rezerwacji i przypomnij sobie o wizycie.',
    color: '#F59E0B',
  },
];

const SERVICES_PREVIEW = [
  { icon: '✂️', name: 'Fryzjerstwo', desc: 'Strzyżenie, koloryzacja, stylizacja', price: 'od 60 zł', color: '#10B981' },
  { icon: '💅', name: 'Paznokcie', desc: 'Manicure, pedicure, hybryda', price: 'od 80 zł', color: '#EC4899' },
  { icon: '🧘', name: 'Masaż', desc: 'Relaksacyjny, głęboki, sportowy', price: 'od 180 zł', color: '#06B6D4' },
  { icon: '🌿', name: 'Kosmetyka', desc: 'Zabiegi na twarz, henna, laminacja', price: 'od 70 zł', color: '#22C55E' },
];

const STATS = [
  { value: '500+', label: 'Zadowolonych klientów' },
  { value: '10', label: 'Rodzajów usług' },
  { value: '4.9', label: 'Średnia ocena' },
  { value: '3 lata', label: 'Doświadczenia' },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* ── Navbar ── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(10, 15, 26, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-primary)',
          padding: '0 var(--space-8)',
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-dark))',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
            }}
          >
            <Sparkles size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
              Salon Aurora
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1 }}>
              System Rezerw
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/panel" className="btn btn-ghost btn-sm hidden-mobile" style={{ display: 'inline-flex' }}>
            Panel admina
          </Link>
          <Link href="/rezerwacja" className="btn btn-primary btn-sm">
            <Calendar size={14} />
            Zarezerwuj wizytę
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          position: 'relative',
          padding: 'var(--space-20) var(--space-8)',
          textAlign: 'center',
          overflow: 'hidden',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Animated background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(16,185,129,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(99,102,241,0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />

        {/* Floating orbs */}
        <div
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
            top: '10%',
            left: '5%',
            animation: 'float 8s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
            bottom: '10%',
            right: '5%',
            animation: 'float 10s ease-in-out infinite reverse',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          <div
            className="badge badge-success"
            style={{ marginBottom: 'var(--space-6)', display: 'inline-flex' }}
          >
            <Star size={12} />
            Numer 1 w Krakowie
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: 'var(--space-6)',
              letterSpacing: '-0.02em',
            }}
          >
            Zarezerwuj wizytę{' '}
            <span className="text-gradient">online</span>{' '}
            w kilka sekund
          </h1>

          <p
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--text-secondary)',
              maxWidth: 540,
              margin: '0 auto var(--space-10)',
              lineHeight: 1.7,
            }}
          >
            Profesjonalne usługi beauty w jednym miejscu. Wybierz usługę, termin i gotowe —
            bez rejestracji, bez czekania.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/rezerwacja" className="btn btn-primary btn-lg">
              <Calendar size={20} />
              Umów wizytę teraz
              <ArrowRight size={16} />
            </Link>
            <Link href="/panel" className="btn btn-secondary btn-lg">
              Panel admina
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Trust badges */}
          <div
            className="flex items-center justify-center gap-6 flex-wrap"
            style={{ marginTop: 'var(--space-10)', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}
          >
            {[
              { icon: <CheckCircle size={14} />, text: 'Bez rejestracji' },
              { icon: <CheckCircle size={14} />, text: 'Bezpłatna anulacja' },
              { icon: <CheckCircle size={14} />, text: 'Potwierdzenie w chwilę' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2" style={{ color: 'var(--accent-primary)' }}>
                {icon}
                <span style={{ color: 'var(--text-secondary)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        style={{
          padding: 'var(--space-12) var(--space-8)',
          borderTop: '1px solid var(--border-primary)',
          borderBottom: '1px solid var(--border-primary)',
          background: 'rgba(255,255,255,0.01)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--container-max)',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 'var(--space-8)',
            textAlign: 'center',
          }}
        >
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div
                style={{
                  fontSize: 'var(--text-3xl)',
                  fontWeight: 900,
                  color: 'var(--accent-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                {value}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: 'var(--space-20) var(--space-8)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
            <div className="badge badge-info" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>
              Jak to działa
            </div>
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
              Rezerwacja w 4 prostych krokach
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
              Bez zbędnych formularzy i rejestracji. Twoja wizyta w mniej niż 2 minuty.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {FEATURES.map(({ icon, title, description, color }, i) => (
              <div
                key={title}
                className="glass-card"
                style={{ padding: 'var(--space-6)', position: 'relative', overflow: 'hidden' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: color,
                    opacity: 0.8,
                  }}
                />
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-xl)',
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color,
                    marginBottom: 'var(--space-4)',
                  }}
                >
                  {icon}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: 'var(--space-4)',
                    right: 'var(--space-4)',
                    fontSize: 'var(--text-4xl)',
                    fontWeight: 900,
                    color: 'rgba(255,255,255,0.03)',
                    lineHeight: 1,
                  }}
                >
                  {i + 1}
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)' }}>
                  {title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section
        style={{
          padding: 'var(--space-20) var(--space-8)',
          background: 'rgba(255,255,255,0.01)',
          borderTop: '1px solid var(--border-primary)',
        }}
      >
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
            <div className="badge badge-success" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>
              Nasze usługi
            </div>
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
              Wszystko czego potrzebujesz
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'var(--space-5)',
            }}
          >
            {SERVICES_PREVIEW.map(({ icon, name, desc, price, color }) => (
              <Link
                key={name}
                href="/rezerwacja"
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="glass-card service-card"
                  style={{ border: `1px solid ${color}20` }}
                >
                  <div style={{ fontSize: '2.5rem', lineHeight: 1, marginBottom: 'var(--space-2)' }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', marginBottom: 'var(--space-1)' }}>
                      {name}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{desc}</div>
                  </div>
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: 'var(--space-3)',
                      borderTop: `1px solid ${color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ color, fontWeight: 700, fontSize: 'var(--text-sm)' }}>{price}</span>
                    <ArrowRight size={14} color={color} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'var(--space-20) var(--space-8)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(99,102,241,0.1))',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-16) var(--space-8)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <Heart
              size={48}
              style={{ color: 'var(--accent-primary)', marginBottom: 'var(--space-6)', opacity: 0.8 }}
            />
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
              Gotowy na zabieg?
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)', fontSize: 'var(--text-lg)' }}>
              Dołącz do setek zadowolonych klientów. Pierwsza wizyta za Tobą!
            </p>
            <Link href="/rezerwacja" className="btn btn-primary btn-lg">
              <Calendar size={20} />
              Zarezerwuj teraz — to bezpłatne
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
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
            gap: 'var(--space-8)',
          }}
        >
          <div>
            <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-4)' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-dark))',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={14} color="#fff" />
              </div>
              <span style={{ fontWeight: 700 }}>Salon Aurora</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
              Profesjonalne usługi beauty w sercu Krakowa. Zadbaj o siebie z nami.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>
              Kontakt
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { icon: <Phone size={14} />, text: '+48 12 345 67 89' },
                { icon: <Mail size={14} />, text: 'kontakt@aurora-salon.pl' },
                { icon: <MapPin size={14} />, text: 'ul. Kwiatowa 15, Kraków' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--accent-primary)' }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>
              Godziny otwarcia
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              <div className="flex justify-between">
                <span>Pon – Pt</span>
                <span style={{ color: 'var(--text-primary)' }}>8:00 – 20:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sobota</span>
                <span style={{ color: 'var(--text-primary)' }}>9:00 – 18:00</span>
              </div>
              <div className="flex justify-between">
                <span>Niedziela</span>
                <span style={{ color: 'var(--status-danger)' }}>Zamknięte</span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 'var(--space-10)',
            paddingTop: 'var(--space-6)',
            borderTop: '1px solid var(--border-primary)',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: 'var(--text-xs)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div>© 2026 Salon Aurora. Wszelkie prawa zastrzeżone.</div>
            <div>
              <Link href="/anuluj" style={{ color: 'var(--status-danger)', textDecoration: 'underline', fontWeight: 500 }}>
                Chcesz anulować lub zarządzać wizytą? Kliknij tutaj
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
