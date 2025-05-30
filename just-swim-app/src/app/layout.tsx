import type { Metadata } from 'next';
import './globals.scss';
import '@/reset.scss';
import { Suspense } from 'react';
import { SigninCheck, SkeletonFallback } from '@components';

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
        <SigninCheck />
        <div className="app_layout">
          <Suspense fallback={<SkeletonFallback />}>{children}</Suspense>
          <div id="modal-portal" />
          <div id="toast-portal" />
        </div>
      </body>
    </html>
  );
}
