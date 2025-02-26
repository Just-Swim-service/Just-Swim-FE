'use client';

import styled from './styles.module.scss';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { IconAdd } from '@assets';
import { useUserStore } from '@store';
import { getMyProfile } from '@apis';
import { useRouter } from 'next/navigation';
import { get, isEmpty, trim } from 'lodash';

export function ScheduleAddButton({ token }: { token: string }) {
  const router = useRouter();
  const { getUserType, getUser, setAddUserProfile, setAddUserToken } =
    useUserStore();
  const [type, setType] = useState<string>('');

  const setUserData = useCallback(async () => {
    try {
      const { status, data } = await getMyProfile();
      if (status === 406) {
        setAddUserToken('');
        return router.replace('/signin');
      }
      setAddUserProfile({ token: token, profile: data?.data });
    } catch (error) {
      setAddUserToken('');
      return router.replace('/signin');
    }
  }, [setAddUserProfile, setAddUserToken, token, router]);

  useEffect(() => {
    const user = getUser();

    if (Object.keys(user).length === 0 || !user) {
      setUserData().then(() => {
        setType(trim(getUserType(token)));
      });
    } else {
      setType(trim(getUserType(token)));
    }
  }, [getUser, getUserType, setUserData, token]);

  return (
    <>
      {type === 'instructor' && (
        <Link href="/schedule/add" className={styled.link}>
          <IconAdd />
        </Link>
      )}
    </>
  );
}
