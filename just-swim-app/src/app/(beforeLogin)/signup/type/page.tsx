'use client';

import styles from './pages.module.scss';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createToken } from '@/(beforeLogin)/_utils';
import { TEXT, USER_TYPE } from '@data';
import { UserType } from '@types';

export default function Type() {
  const params = useSearchParams().get('token');
  const [type, setType] = useState<UserType>();

  useEffect(() => {
    const token = async () => {
      if (params) {
        await createToken({ token: params });
      }
    };
    token();
  }, [params]);

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
                onClick={() => setType(data)}>
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
          <Link
            href={{
              pathname: `/login/profile`,
              query: { type: `${type}` },
            }}>
            <button className={styles.select_button}>
              {TEXT.COMMON_PAGE.select}
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
