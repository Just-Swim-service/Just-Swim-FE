'use client';

import StartHeader from './_component/start/startHeader';
import StartSection from './_component/start/startSection';
import StartFooter from './_component/start/startFooter';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Start() {
  const param = useSearchParams();
  const router = useRouter();
  const handleRoute = () => {
    const redirectTimeout = setTimeout(() => {
      router.push(`/${param.get('type')}`);
    }, 2000);

    return () => clearTimeout(redirectTimeout);
  };

  return (
    <>
      <StartHeader />
      <StartSection param={param} />
      <StartFooter handleRoute={handleRoute} />
    </>
  );
}
