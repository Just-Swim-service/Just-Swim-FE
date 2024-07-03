'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { StartHeader, StartSection, StartFooter } from './_components';

export default function Start() {
  const param = useSearchParams();
  const router = useRouter();
  const handleRoute = () => {
    const userType = param.get('type');
    if (!userType) {
      return;
    }
    if (userType === 'instructor') {
      router.push(`/instructor`);
    } else {
      router.push(`/customer`);
    }
  };

  return (
    <>
      <StartHeader />
      <StartSection param={param} />
      <StartFooter handleRoute={handleRoute} />
    </>
  );
}
