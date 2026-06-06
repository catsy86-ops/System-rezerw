// ============================================================
// ROOT LAYOUT
// ============================================================

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/ToastProvider';

export const metadata: Metadata = {
  title: 'Nocny Promil — Całodobowy Dowóz Alkoholu',
  description: 'Zarezerwuj szybką dostawę alkoholu w nocy. Szybko, wygodnie i bez wychodzenia z domu.',
  keywords: 'dowóz alkoholu szczecin, nocny promil, dostawa alkoholu, alkohol na telefon',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Nocny Promil',
  },
};

export const viewport: Viewport = {
  themeColor: '#10B981',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
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
