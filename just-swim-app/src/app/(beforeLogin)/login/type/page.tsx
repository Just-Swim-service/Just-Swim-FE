'use client';

import { useState } from 'react';

import { SelectTypeHeader, SelectTypeSection, SelectTypeFooter } from './_components';

export default function SelectType() {
  const [type, setType] = useState<string>('');
  const handleType = (type: string) => setType(type);

  return (
    <>
      <SelectTypeHeader />
      <SelectTypeSection type={type} handleType={handleType} />
      <SelectTypeFooter type={type} />
    </>
  );
}
