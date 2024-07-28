'use client';

import styles from './pages.module.scss';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';
import { setTokenInCookies, getTokenInCookies } from '@/(beforeLogin)/_utils';
import { HTTP_STATUS, TEXT, USER_TYPE } from '@data';
import {
  GetUserProfileRes,
  PostSetUserTypeReq,
  UserEntity,
  UserType,
} from '@types';

import { StateCreator, create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { usePostSetUserType } from '@/(beforeLogin)/_utils/server/usePostSetUserType';
import { getMyProfile } from '@/_apis/users.ts';

export type User = {
  token: string;
  profile: Partial<UserEntity>;
};

// TODO: store 로 따로 만들어야 한다.
type UserStoreType = {
  users: Record<string, Partial<Omit<User, 'token'>>>;
  setAddUserToken: (token: string) => void;
  setAddUserProfile: ({ token, profile }: User) => void;
};

export const useUserStore = create(
  persist<UserStoreType>(
    (set, get) => ({
      users: {},
      setAddUserToken: (token: string) => {
        set((state: UserStoreType) => {
          const overWriteUsers = {
            ...state.users,
            [token]: { ...state.users[token], profile: {} },
          };

          return {
            ...state,
            users: overWriteUsers,
          };
        });
      },
      setAddUserProfile: ({ token, profile }: User) => {
        set((state: UserStoreType) => {
          const prevUsers = state.users[token] || { profile: {} };
          const overWriteUsers = {
            ...state.users,
            [token]: {
              ...prevUsers,
              profile: { ...prevUsers.profile, ...profile },
            },
          };

          return {
            ...state,
            users: overWriteUsers,
          };
        });
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// TODO: useLayoutEffect 로 변경
// TODO: fetch 캐싱 도입
// TODO: 상수화 필요
// TODO: signup 페이지 접근하면 signup/type 페이지로 이동
export default function Type() {
  const router = useRouter();
  const params = useSearchParams().get('token');

  const [type, setType] = useState<UserType>();
  const [token, setToken] = useState<string>();

  const { setAddUserToken, setAddUserProfile } = useUserStore();
  const { setUserType } = usePostSetUserType();

  useLayoutEffect(() => {
    const checkToken = async () => {
      // TODO: URL 로 접근했을 때 처리 필요
      if (params) {
        const newToken = await setTokenInCookies(params);
        setAddUserToken(newToken);

        const { data } = await getMyProfile();
        setAddUserProfile({ token: newToken, profile: data });
        setToken(newToken);
      }
    };
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetType = async () => {
    if (!token) {
      router.replace('/signin');
    } else {
      const { status } = await setUserType({ userType: type as UserType });

      if (status === HTTP_STATUS.OK) {
        setAddUserProfile({
          token: token,
          profile: { userType: type },
        });
        return router.push('/signup/profile');
      } else if (status === HTTP_STATUS.NOT_ACCEPTABLE) {
        // TODO: URL 접근 시 이미 가입한 유저에 대한 처리 필요
        console.log('이미 가입한 유저에 대한 처리 필요');
      }
    }
  };

  return (
    <>
      <div className={styles.select_type_header}>
        <div>
          <h3>
            {TEXT.TYPE_SELECT_PAGE.notification.first}
            <br />
            {TEXT.TYPE_SELECT_PAGE.notification.second}
          </h3>
        </div>
        <div>
          <p>{TEXT.TYPE_SELECT_PAGE.helper.first}</p>
        </div>
      </div>

      <div className={styles.select_type_section}>
        {Object.values(USER_TYPE).map((data) => {
          return (
            <div className={styles.type_button_wrapper} key={data}>
              <button
                className={`${styles.type_button} ${styles[`${data === type ? 'active' : ''}`]}`}
                onClick={() => setType(data)}>
                <div className={styles.type_button_img}>
                  <div></div>
                </div>
                <div className={styles.type_button_info}>
                  <div>
                    <h3>{TEXT.TYPE_SELECT_PAGE.type[data]}</h3>
                  </div>
                  <div>
                    <p>
                      {TEXT.TYPE_SELECT_PAGE.helper[data].first}
                      <br />
                      {TEXT.TYPE_SELECT_PAGE.helper[data].second}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
      <div className={styles.select_type_footer}>
        <div
          className={`${styles.button_wrapper} ${styles[type ? 'active' : '']}`}>
          {/* <Link
            href={{
              pathname: `/signup/profile`,
            }}> */}
          <button
            type="button"
            className={styles.select_button}
            // onClick={() => setAddUserType({ token, type })}
            onClick={handleSetType}>
            {TEXT.COMMON.select}
          </button>
          {/* </Link> */}
        </div>
      </div>
    </>
  );
}
