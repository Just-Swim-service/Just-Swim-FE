'use client';

import StartHeader from './_component/start/startHeader';
import StartSection from './_component/start/startSection';
import StartFooter from './_component/start/startFooter';
import { useSearchParams } from 'next/navigation';

export default function Welcome() {
  const param = useSearchParams();
  console.log('param: ', param);
  return (
    <>
      <StartHeader />
      <StartSection param={param} />
      <StartFooter />
    </>
  );
}
