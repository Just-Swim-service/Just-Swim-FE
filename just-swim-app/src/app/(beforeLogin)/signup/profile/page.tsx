'use client';

import styles from './pages.module.scss';
import { Suspense, useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { HTTP_STATUS, TEXT, USER_TYPE, ROUTES } from '@data';
import { IconGallery, IconInputValid } from '@assets';
import { URLImage } from '@components';
import { patchUserEdit } from '@apis';
import { useUserStore } from '@store';
import { UserType } from '@types';

export default function Profile() {
  const router = useRouter();

  const { getUserName, getUserType, getToken, getUserImage, setAddUserProfile } =
    useUserStore();
  const userToken = getToken();
  const [type, setType] = useState<UserType>();
  const [valid, setValid] = useState<boolean>(false);
  const [inputName, setInputName] = useState<string>('');
  const [inputImage, setInputImage] = useState<string>('');

  useLayoutEffect(() => {
    if (!userToken) {
      router.push(ROUTES.ONBOARDING.signin);
    } else {
      setType(getUserType(userToken));
      setInputName(getUserName(userToken));
      setInputImage(getUserImage(userToken));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setValid(true);
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
    setValid(true);
  };

  return (
    <>
      <div className={styles.profile_setting_header}>
        <div>
          <h3>
            {type === USER_TYPE.INSTRUCTOR
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
            <URLImage imageURL={inputImage} alt="profile image" />
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
        <div className={styles.nickname_wrapper}>
          <input
            type="text"
            value={inputName}
            onChange={handleInputName}
            className={styles.nickname}
          />
          {valid && <IconInputValid width={18} height={18} />}
        </div>
      </div>
      <div className={styles.profile_setting_footer}>
        <div className={styles.button_wrapper}>
          <button
            className={`${styles.select_button} ${styles.active}`}
            onClick={handleNextPage}>
            {valid ? TEXT.COMMON.done : TEXT.COMMON.next}
          </button>
        </div>
      </div>
    </>
  );
}
