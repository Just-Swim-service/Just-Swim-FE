'use client';

import { SigninCheck } from '@components';

export default function AfterLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SigninCheck />
      {children}
    </>
  );
}
