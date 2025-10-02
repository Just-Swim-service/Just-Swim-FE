'use client';

import { usePathname } from 'next/navigation';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSchedule = pathname.startsWith('/schedule');
  const isCommunity = pathname.startsWith('/community');
  const shouldApplyAppLayout = !isSchedule && !isCommunity;

  return (
    <div className={shouldApplyAppLayout ? 'app_layout' : ''}>
      {children}
      <div id="modal-portal" />
      <div id="toast-portal" />
    </div>
  );
}
