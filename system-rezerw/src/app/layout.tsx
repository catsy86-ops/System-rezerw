// ============================================================
// ROOT LAYOUT
// ============================================================

import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/ToastProvider';

export const metadata: Metadata = {
  title: 'uFisza — Ekskluzywny Salon Fryzjerski',
  description: 'Zarezerwuj wizytę w salonie uFisza online. Szybko, wygodnie i bez rejestracji.',
  keywords: 'fryzjer szczecin, ufisza, salon fryzjerski, rezerwacja online',
  manifest: '/manifest.json',
  themeColor: '#10B981',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'uFisza',
  },
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
                            });
                            }
                            if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
                            window.addEventListener('load', function() {
                            navigator.serviceWorker.register('/sw.js').then(function(registration) {
                            console.log('ServiceWorker registration successful with scope: ', registration.scope);
                            }, function(err) {
                            console.log('ServiceWorker registration failed: ', err);
                            });
                            });
                            }
                            } catch (e) {}
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
