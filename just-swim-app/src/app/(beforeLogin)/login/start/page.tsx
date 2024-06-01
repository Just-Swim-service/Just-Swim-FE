'use client';

import StartHeader from './_component/start/startHeader';
import StartSection from './_component/start/startSection';
import StartFooter from './_component/start/startFooter';
import { useRouter, useSearchParams } from 'next/navigation';

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
