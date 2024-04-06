'use client';

import SelectTypeHeader from './_component/selectType/SelectTypeHeader';
import SelectTypeSection from './_component/selectType/SelectTypeSection';
import SelectTypeFooter from './_component/selectType/SelectTypeFooter';
import { useState } from 'react';

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
