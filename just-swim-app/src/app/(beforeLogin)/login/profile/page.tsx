'use client';

import { notFound, useSearchParams } from 'next/navigation';

import { ProfileSettingHeader, ProfileSettingSection, ProfileSettingFooter } from './_components';

export default function Profile() {
  const type = useSearchParams().get('type')?.toString();
  const name = type === 'instructor' ? '수강생' : '강사';
  // 타입없이 접근했을 때 처리 필요.

  return (
    <>
      <ProfileSettingHeader name={name} />
      <ProfileSettingSection />
      <ProfileSettingFooter type={type} />
    </>
  );
}
