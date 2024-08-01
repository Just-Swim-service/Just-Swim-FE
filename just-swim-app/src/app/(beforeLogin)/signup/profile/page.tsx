'use client';

import styles from './pages.module.scss';
import { useRouter } from 'next/navigation';
import { IconGallery } from '@assets';

import { HTTP_STATUS, TEXT, USER_TYPE } from '@data';
import { useUserStore } from '../type/page';
import { lazy, Suspense, useEffect, useState } from 'react';
import { UserType } from '@types';
import Image, { ImageLoaderProps } from 'next/image';
import { patchUserEdit } from '@/_apis/users.ts';
import { ROUTES } from '@/_data/routes';

// TODO: myLoader 를 공통으로 빼서 사용하도록 수정
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
    const { status } = await patchUserEdit({
      profileImage: inputImage,
      name: inputName,
    });

    if (status === HTTP_STATUS.OK) {
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
              ? TEXT.SET_PROFILE_PAGE.notification.customer
              : TEXT.SET_PROFILE_PAGE.notification.instructor}
            <br />
            {TEXT.SET_PROFILE_PAGE.notification.common.first}
          </h3>
        </div>
        <div>
          <p>{TEXT.SET_PROFILE_PAGE.notification.common.second}</p>
        </div>
      </div>
      <div className={styles.profile_setting_section}>
        <div className={styles.profile_image_wrapper}>
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
          <label htmlFor="select_image" className={styles.image_button}>
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
