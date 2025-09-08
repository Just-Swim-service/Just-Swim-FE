import type { Metadata } from 'next';
import './globals.scss';
import '@/reset.scss';
import { Suspense } from 'react';
import {
  SkeletonFallback,
  PWAInstallPrompt,
  ToastProvider,
  ErrorBoundary,
} from '@components';
import { AppWrapper } from './appWrapper';
import localFont from 'next/font/local';

export const metadata: Metadata = {
  title: 'Just Swim',
  description: 'VIP Swimming Feedback Service',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' }],
  },
  themeColor: '#0080ff',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Just Swim',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Just Swim',
  },
};

const suitFont = localFont({
  src: [
    {
      path: '../fonts/SUIT-Variable-woff2/SUIT-Variable.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-suit',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={suitFont.variable}>
      <body>
        <ErrorBoundary>
          <ToastProvider>
            <AppWrapper>
              <Suspense fallback={<SkeletonFallback />}>{children}</Suspense>
            </AppWrapper>
            <PWAInstallPrompt />
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
