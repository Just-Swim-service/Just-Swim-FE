'use client';

import ProfileHeader from './_component/profile/ProfileHeader';
import ProfileSection from './_component/profile/ProfileSection';
import ProfileFooter from './_component/profile/ProfileFooter';
import { useState } from 'react';

export default function Profile() {
  const [type, setType] = useState<string>('');
  const handleType = (type: string) => setType(type);

  return (
    <>
      <ProfileHeader />
      <ProfileSection type={type} handleType={handleType} />
      <ProfileFooter type={type} />
    </>
  );
}
