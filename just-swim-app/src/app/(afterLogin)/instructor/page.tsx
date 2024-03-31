'use client';

import { useSearchParams } from 'next/navigation';

export default function Instructor() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');

  console.log('type : ', type);

  return (
    <div>
      <h1>강사 홈</h1>
    </div>
  );
}
