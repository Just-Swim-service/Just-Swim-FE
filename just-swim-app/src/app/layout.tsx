import type { Metadata } from 'next';
import './globals.scss';
import '@/reset.scss';
import { Suspense } from 'react';
import { SkeletonFallback } from '@components';
import { AppWrapper } from './appWrapper';
import localFont from 'next/font/local';

export const metadata: Metadata = {
  title: 'Just Swim',
  description: 'VIP Swimming Feedback Service',
  icons: {
    icon: '/favicon.ico',
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
    <html>
      <body>
        <AppWrapper>
          <Suspense fallback={<SkeletonFallback />}>{children}</Suspense>
        </AppWrapper>
      </body>
    </html>
  );
}
