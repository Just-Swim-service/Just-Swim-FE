'use client';

import styles from './pages.module.scss';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { setUserType } from '@utils';
import { HTTP_STATUS, TEXT, USER_TYPE, ROUTES } from '@data';
import { getCachedMyProfile } from '@apis';
import { UserType } from '@types';

export default function Type() {
  const router = useRouter();
  const [type, setType] = useState<UserType>();

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const data = await getCachedMyProfile();

        if (data?.userType) {
          return router.replace(ROUTES.SCHEDULE.root);
        }
      } catch (err) {
        return router.replace(ROUTES.ONBOARDING.signin);
      }
    };

    checkUserType();
  }, [router]);

  const handleSetType = async () => {
    if (!type) return;

    const { status } = await setUserType({ userType: type });
    if (status === HTTP_STATUS.OK) {
      router.push(ROUTES.ONBOARDING.profile);
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
        {Object.values(USER_TYPE).map((data) => (
          <div className={styles.type_button_wrapper} key={data}>
            <button
              className={`${styles.type_button} ${type === data ? styles.active : ''}`}
              onClick={() => setType(data)}>
              <div className={styles.type_button_img}>
                <div></div>
              </div>
              <div className={styles.type_button_info}>
                <h3>{TEXT.TYPE_SELECT_PAGE.type[data]}</h3>
                <p>
                  {TEXT.TYPE_SELECT_PAGE.helper[data].first}
                  <br />
                  {TEXT.TYPE_SELECT_PAGE.helper[data].second}
                </p>
              </div>
            </button>
          </div>
        ))}
      </div>

      <div className={styles.select_type_footer}>
        <button
          type="button"
          className={`${styles.select_button} ${type ? styles.active : ''}`}
          onClick={handleSetType}>
          {TEXT.COMMON.select}
        </button>
      </div>
    </>
  );
}
