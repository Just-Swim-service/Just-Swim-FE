'use client';

import styles from './pages.module.scss';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { setTokenInCookies, getTokenInCookies } from '@/(beforeLogin)/_utils';
import { TEXT, USER_TYPE } from '@data';
import { UserType } from '@types';

import { StateCreator, create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type User = {
  token: string;
  type: UserType | null | undefined;
};

// TODO: store 로 따로 만들어야 한다.
type UserStoreType = {
  users: Record<string, Omit<User, 'token'>>;
  setAddUserToken: (token: string) => void;
  setAddUserType: ({ token, type }: User) => void;
};

const useUserStore = create(
  persist<UserStoreType>(
    (set, get) => ({
      users: {},
      setAddUserToken: (token: string) => {
        set((state: UserStoreType) => {
          const newUsers = { ...state.users, [token]: { type: null } };

          return {
            ...state,
            users: newUsers,
          };
        });
      },
      setAddUserType: ({ token, type }: User) => {
        set((state: UserStoreType) => {
          const newUsers = { ...state.users, [token]: { type } };

          return {
            ...state,
            users: newUsers,
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

// TODO: signup 페이지 접근하면 signup/type 페이지로 이동
export default function Type() {
  const router = useRouter();
  const params = useSearchParams().get('token');

  const [type, setType] = useState<UserType>();
  const [token, setToken] = useState<string>();
  const { users, setAddUserToken, setAddUserType } = useUserStore();
  console.log('users: ', users);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getTokenInCookies();

      if (!token && !params) {
        return router.replace('/signin');
      }
      if (token) {
        const checkType = users[token]?.type;

        if (
          checkType === USER_TYPE.INSTRUCTOR ||
          checkType === USER_TYPE.CUSTOMER
        ) {
          setAddUserToken(token);
          //   상수화 필요
          router.replace('/schedule');
        } else {
          // console.log('타입 없음 - 타입 선택 페이지로 이동');
          setAddUserToken(token);
          setToken(token);
        }
      } else if (params) {
        // console.log('토큰 없음 - params 있음');
        const token = setTokenInCookies(params);

        setAddUserToken(token);
        setToken(token);
      }
    };
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetType = (type: UserType) => {
    if (!token) {
      router.replace('/signin');
    } else {
      setAddUserType({ token, type });
      setType(type);
    }
  };

  return (
    <>
      <div className={styles.select_type_header}>
        <div>
          <h3>
            {TEXT.SELECT_PAGE.notification.first}
            <br />
            {TEXT.SELECT_PAGE.notification.second}
          </h3>
        </div>
        <div>
          <p>{TEXT.SELECT_PAGE.helper.first}</p>
        </div>
      </div>

      <div className={styles.select_type_section}>
        {Object.values(USER_TYPE).map((data) => {
          return (
            <div className={styles.type_button_wrapper} key={data}>
              <button
                className={`${styles.type_button} ${styles[`${data === type ? 'active' : ''}`]}`}
                onClick={() => handleSetType(data)}>
                <div className={styles.type_button_img}>
                  <div></div>
                </div>
                <div className={styles.type_button_info}>
                  <div>
                    <h3>{TEXT.SELECT_PAGE.type[data]}</h3>
                  </div>
                  <div>
                    <p>
                      {TEXT.SELECT_PAGE.helper[data].first}
                      <br />
                      {TEXT.SELECT_PAGE.helper[data].second}
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
            className={styles.select_button}
            // onClick={() => setAddUserType({ token, type })}
          >
            {TEXT.COMMON_PAGE.select}
          </button>
          {/* </Link> */}
        </div>
      </div>
    </>
  );
}
