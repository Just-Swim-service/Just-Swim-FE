import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Just Swim',
    description: 'VIP Swimming Feedback Service',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html>
            <body>{children}</body>
        </html>
    );
}
