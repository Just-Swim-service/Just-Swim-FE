'use client';

import styles from './pages.module.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';
import { getTokenInCookies, setTokenInCookies } from '@/(beforeLogin)/_utils';
import { HTTP_STATUS, TEXT, USER_TYPE } from '@data';
import { UserType } from '@types';

import { usePostSetUserType } from '@/(beforeLogin)/_utils/server/usePostSetUserType';
import { getMyProfile } from '@/_apis/users.ts';
import { ROUTES } from '@/_data/routes';
import { useUserStore } from '@/_store/user';

// TODO: fetch 캐싱 알아보기
export default function Type() {
  const router = useRouter();
  const params = useSearchParams().get('token');

  const [type, setType] = useState<UserType>();
  const [token, setToken] = useState<string>();

  const { setAddUserToken, setAddUserProfile, getUserType } = useUserStore();
  const { setUserType } = usePostSetUserType();

  useLayoutEffect(() => {
    const checkToken = async () => {
      if (params) {
        const newToken = await setTokenInCookies(params);
        setAddUserToken(newToken);

        const { data } = await getMyProfile();
        setAddUserProfile({ token: newToken, profile: data.data });
        if (data.data.userType) {
          return router.push(ROUTES.SCHEDULE.root);
        }
        setToken(newToken);
      } else {
        const authorizationToken = await getTokenInCookies();
        const userType = getUserType(authorizationToken);

        if (userType) {
          return router.replace(ROUTES.SCHEDULE.root);
        }
        setToken(authorizationToken);
      }
    };
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetType = async () => {
    if (!token) {
      router.replace(ROUTES.ONBOARDING.signin);
    } else {
      const { status } = await setUserType({ userType: type as UserType });

      if (status === HTTP_STATUS.OK) {
        setAddUserProfile({
          token: token,
          profile: { userType: type },
        });
        return router.push(ROUTES.ONBOARDING.profile);
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
          <button
            type="button"
            className={styles.select_button}
            onClick={handleSetType}>
            {TEXT.COMMON.select}
          </button>
        </div>
      </div>
    </>
  );
}
