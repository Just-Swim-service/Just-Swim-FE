import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Just Swim',
  description: 'VIP Swimming Feedback Service',
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Readonly<Props>) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}