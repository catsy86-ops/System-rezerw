// ============================================================
// ROOT LAYOUT
// ============================================================

import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/ToastProvider';

export const metadata: Metadata = {
  title: 'System Rezerw — Profesjonalne Rezerwacje Wizyt',
  description: 'Zarezerwuj wizytę w naszym salonie online. Szybko, wygodnie i bez rejestracji.',
  keywords: 'rezerwacja, salon, wizyta, fryzjer, kosmetyczka, masaż, paznokcie',
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
