'use client';

import SelectTypeHeader from './_component/selectType/SelectTypeHeader';
import SelectTypeSection from './_component/selectType/SelectTypeSection';
import SelectTypeFooter from './_component/selectType/SelectTypeFooter';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [type, setType] = useState<string>('');
  const router = useRouter();
  const handleType = (type: string) => setType(type);

  return (
    <>
      <SelectTypeHeader />
      <SelectTypeSection type={type} handleType={handleType} />
      <SelectTypeFooter type={type} />
    </>
  );
}
