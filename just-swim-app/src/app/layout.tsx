import type { Metadata } from 'next';
import './globals.scss';
import '@/reset.scss';
import { Suspense } from 'react';
import { SkeletonFallback } from '@components';
import { AppWrapper } from './appWrapper';

export const metadata: Metadata = {
  title: 'Just Swim',
  description: 'VIP Swimming Feedback Service',
  icons: {
    icon: '/favicon.ico',
  },
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Readonly<Props>) {
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
