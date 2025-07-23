import type { Metadata } from 'next';
import './globals.scss';
import '@/reset.scss';
import { Suspense } from 'react';
import { SkeletonFallback } from '@components';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  const isSchedulePage = pathname.startsWith('/schedule');

  return (
    <html>
      <body>
        <div className={isSchedulePage ? '' : 'app_layout'}>
          <Suspense fallback={<SkeletonFallback />}>{children}</Suspense>
          <div id="modal-portal" />
          <div id="toast-portal" />
        </div>
      </body>
    </html>
  );
}
