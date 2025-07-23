'use client';

import { usePathname } from 'next/navigation';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSchedule = pathname.startsWith('/schedule');

  return (
    <div className={isSchedule ? '' : 'app_layout'}>
      {children}
      <div id="modal-portal" />
      <div id="toast-portal" />
    </div>
  );
}
