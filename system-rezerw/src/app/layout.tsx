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
    <html lang="pl" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
                try {
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(function(registrations) {
                      for (var i = 0; i < registrations.length; i++) {
                        registrations[i].unregister().then(function(success) {
                          if (success) {
                            console.log('Stale ServiceWorker unregistered:', registrations[i]);
                            if ('caches' in window) {
                              caches.keys().then(function(keys) {
                                Promise.all(keys.map(function(key) {
                                  return caches.delete(key);
                                }));
                              });
                            }
                            if (!sessionStorage.getItem('sw_reloaded')) {
                              sessionStorage.setItem('sw_reloaded', 'true');
                              window.location.reload();
                            }
                          }
                        });
                      }
                    });
                  }
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
