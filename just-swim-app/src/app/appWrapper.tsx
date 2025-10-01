'use client';

import { usePathname } from 'next/navigation';

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSchedule = pathname.startsWith('/schedule');
  const isCommunityCreate = pathname.startsWith('/community/create');
  const shouldApplyAppLayout = !isSchedule && !isCommunityCreate;

  return (
    <div className={shouldApplyAppLayout ? 'app_layout' : ''}>
      {children}
      <div id="modal-portal" />
      <div id="toast-portal" />
    </div>
  );
}
