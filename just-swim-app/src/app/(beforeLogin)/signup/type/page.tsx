'use client';
// import { useState } from 'react';

import { cookies } from 'next/headers';
import { useSearchParams } from 'next/navigation';

// import {
//   SelectTypeHeader,
//   SelectTypeSection,
//   SelectTypeFooter,
// } from './_components';

export default function Type() {
  const params = useSearchParams().get('token');
  console.log('params: ', params);

  //   cookies().set([key: 'token', value: ]);
  //   const [type, setType] = useState<string>('');
  //   const handleType = (type: string) => setType(type);

  return (
    <>
      {/* <SelectTypeHeader />
      <SelectTypeSection type={type} handleType={handleType} />
      <SelectTypeFooter type={type} /> */}
    </>
  );
}
