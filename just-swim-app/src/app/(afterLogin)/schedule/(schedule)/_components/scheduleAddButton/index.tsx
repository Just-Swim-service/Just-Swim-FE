'use client';

import styled from './styles.module.scss';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IconAdd } from '@assets';
import { getCachedMyProfile } from '@apis';
import { useRouter } from 'next/navigation';
import { isEmpty } from 'lodash';

type ProfileInfo = {
  name: string;
  profileImage: string;
  userType: string;
};

export function ScheduleAddButton({ token }: { token: string }) {
  const router = useRouter();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>();

  useEffect(() => {
    const fetchProfileInfo = async () => {
      const response = await getCachedMyProfile();
      if (isEmpty(response)) {
        return router.replace('/signin');
      }
      setProfileInfo(response as ProfileInfo);
    };
    fetchProfileInfo();
  }, [router]);

  return (
    <>
      {profileInfo?.userType === 'instructor' && (
        <Link href="/schedule/add" className={styled.link}>
          <IconAdd />
        </Link>
      )}
    </>
  );
}
