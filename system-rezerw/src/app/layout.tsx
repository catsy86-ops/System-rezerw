// ============================================================
// ROOT LAYOUT
// ============================================================

import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/ToastProvider';

export const metadata: Metadata = {
  title: 'naŁuczniczej — Ekskluzywny Salon Fryzjersko-Kosmetyczny',
  description: 'Zarezerwuj wizytę w salonie naŁuczniczej online. Szybko, wygodnie i bez rejestracji.',
  keywords: 'fryzjer szczecin, kosmetyczka szczecin, nałuczniczej, salon fryzjerski, paznokcie kraków, rezerwacja online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
