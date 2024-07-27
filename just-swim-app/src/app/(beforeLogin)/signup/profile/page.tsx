'use client';

import styles from './pages.module.scss';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import Gallery from '@assets/gallery.svg';

import Link from 'next/link';
import { TEXT } from '@data';
import { useUserStore } from '../type/page';
import { useLayoutEffect, useState } from 'react';
import { getTokenInCookies } from '@/(beforeLogin)/_utils';

export default function Profile() {
  const router = useRouter();

  const { users, setAddUserToken, setAddUserType } = useUserStore();
  const [userToken, setUserToken] = useState<string>('');

  // 쿠키로 접근해서 타입 찾기 - 없을 때 타입 설정 페이지로 이동
  //   const type = useSearchParams().get('type')?.toString();
  //   const name = type === 'instructor' ? '수강생' : '강사';
  const type = 'instructor';

  useLayoutEffect(() => {
    const setToken = async () => {
      const token = await getTokenInCookies();
      setUserToken(token || '');
    };
    setToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSkipPage = () => {
    router.push(`/signup/complete`);
  };

  return (
    <>
      <div className={styles.profile_setting_header}>
        <div>
          <h3>
            {TEXT.SET_PROFILE_PAGE.notification[type]}
            <br />
            {TEXT.SET_PROFILE_PAGE.notification.common.first}
          </h3>
        </div>
        <div>
          <p>{TEXT.SET_PROFILE_PAGE.notification.common.second}</p>
        </div>
      </div>
      {/*  */}
      <div className={styles.profile_setting_section}>
        <div>
          <div className={styles.profile_img}>
            <div className={styles.gallery_button_wrapper}>
              <button
                // onClick={handleButtonClick}
                className={styles.gallery_button}>
                <Gallery />
                {/* <Image
                  src={Gallery}
                  alt="gallery"
                  // onClick={() =>
                  //   inputFileRef.current && inputFileRef.current.click()
                  // } // 이미지 클릭 시 파일 입력 클릭
                /> */}
              </button>
              <input
                type="file"
                // accept="image/*"
                // ref={inputFileRef}
                style={{ display: 'none' }}
                // onChange={handleImageSelect} // 파일 입력 변경 시 handleImageSelect 함수 호출
              />
            </div>
          </div>
        </div>
        {/* <input type="text" value={nickname} onChange={handleChange} /> */}
        <input type="text" className={styles.nickname} />
      </div>
      {/*  */}
      <div className={styles.profile_setting_footer}>
        <div className={styles.button_wrapper}>
          <Link
            href={{
              pathname: `/login/start`,
              query: { type: type },
            }}>
            <button className={`${styles.select_button} ${styles.active}`}>
              {TEXT.COMMON.next}
            </button>
          </Link>
        </div>
        <div className={styles.button_wrapper}>
          <button
            className={`${styles.select_button} ${styles.inactive}`}
            onClick={handleSkipPage}>
            {TEXT.COMMON.skip}
          </button>
        </div>
      </div>
    </>
  );
}
