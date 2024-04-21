'use client';

import ProfileHeader from './_component/profile/ProfileHeader';
import ProfileSection from './_component/profile/ProfileSection';
import ProfileFooter from './_component/profile/ProfileFooter';
import { useSearchParams } from 'next/navigation';

export default function Profile() {
  const type = useSearchParams().get('type')?.toString();
  const name = type === 'instructor' ? '수강생' : '강사';
  // 타입없이 접근했을 때 처리 필요.

  return (
    <>
      <ProfileHeader name={name} />
      <ProfileSection />
      <ProfileFooter type={type} />
    </>
  );
}
