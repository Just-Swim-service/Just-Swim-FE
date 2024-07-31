'use client';

import styles from './pages.module.scss';
import { useRouter } from 'next/navigation';
import { IconGallery } from '@assets';

import { TEXT, USER_TYPE } from '@data';
import { useUserStore } from '../type/page';
import { lazy, Suspense, useEffect, useState } from 'react';
import { UserType } from '@types';
import Image, { ImageLoaderProps } from 'next/image';
import { patchUserEdit } from '@/_apis/users.ts';
import { ROUTES } from '@/_data/routes';

// 쿠키로 접근해서 타입 찾기 - 없을 때 타입 설정 페이지로 이동
//   const type = useSearchParams().get('type')?.toString();
//   const name = type === 'instructor' ? '수강생' : '강사';
//   const type = 'instructor';
const myLoader = ({ src, width, quality }: ImageLoaderProps) => {
  return `${src}?w=${width}&q=${quality}`;
};

export default function Profile() {
  const router = useRouter();

  const { getUserName, getUserType, getToken, getUserImage, setAddUserProfile } =
    useUserStore();
  const userToken = getToken();
  const [userType, setUserType] = useState<UserType>();
  const [inputName, setInputName] = useState<string>('');
  const [inputImage, setInputImage] = useState<string>('');

  useEffect(() => {
    if (!userToken) {
      router.push(ROUTES.ONBOARDING.signin);
    } else {
      setUserType(getUserType(userToken));
      setInputName(getUserName(userToken));
      setInputImage(getUserImage(userToken));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSkipPage = () => {
    router.push(ROUTES.ONBOARDING.complete);
  };

  const handleNextPage = async () => {
    // DB 에 적용 후 성공하면 zustand 에 저장

    const { status, data } = await patchUserEdit({
      profileImage: inputImage,
      name: inputName,
    });

    if (status === 200) {
      setAddUserProfile({
        token: userToken,
        profile: {
          name: inputName,
          profileImage: inputImage,
        },
      });
      router.push(ROUTES.ONBOARDING.complete);
    }
  };

  const handleInputName = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(evt.target.value);
  };

  const handleInputImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    const file = evt.target.files?.[0];

    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        setInputImage(reader.result as string);
      };
    }
  };

  return (
    <>
      <div className={styles.profile_setting_header}>
        <div>
          <h3>
            {userType === USER_TYPE.INSTRUCTOR
              ? TEXT.SET_PROFILE_PAGE.notification.instructor
              : TEXT.SET_PROFILE_PAGE.notification.customer}
            <br />
            {TEXT.SET_PROFILE_PAGE.notification.common.first}
          </h3>
        </div>
        <div>
          <p>{TEXT.SET_PROFILE_PAGE.notification.common.second}</p>
        </div>
      </div>
      <div className={styles.profile_setting_section}>
        <div className={styles.profile_img}>
          <Image
            loader={myLoader}
            src={inputImage}
            alt="profile image"
            width={125}
            height={125}
            priority
          />
        </div>
        <div>
          <label
            htmlFor="select_image"
            className={styles.gallery_button_wrapper}>
            <IconGallery />
            <div>
              <input
                type="file"
                id="select_image"
                accept="image/*"
                onChange={handleInputImage}
                className={styles.input_file}
              />
            </div>
          </label>
        </div>
        <input
          type="text"
          value={inputName}
          onChange={handleInputName}
          className={styles.nickname}
        />
      </div>
      <div className={styles.profile_setting_footer}>
        <div className={styles.button_wrapper}>
          <button
            className={`${styles.select_button} ${styles.active}`}
            onClick={handleNextPage}>
            {TEXT.COMMON.next}
          </button>
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
