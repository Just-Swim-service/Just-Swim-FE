'use client';
import { FullPageLoader } from '@/_components/common/loading';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/schedule/weekly') {
      router.replace('/schedule/weekly');
    }
  }, [router, pathname]);

  return <FullPageLoader />;
}
