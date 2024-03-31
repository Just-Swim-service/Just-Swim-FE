'use client';

import { useSearchParams } from 'next/navigation';

export default function Customer() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');

  console.log('type : ', type);

  return (
    <div>
      <h1>회원 홈</h1>
    </div>
  );
}
