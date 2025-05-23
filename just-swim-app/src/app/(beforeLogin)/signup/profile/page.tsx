'use client';

import styles from './pages.module.scss';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { HTTP_STATUS, TEXT, USER_TYPE, ROUTES } from '@data';
import { IconGallery, IconInputValid } from '@assets';
import { URLImage } from '@components';
import { getMyProfile, patchUserEdit } from '@apis';

export default function Profile() {
  const router = useRouter();
  const [type, setType] = useState<string>();
  const [valid, setValid] = useState<boolean>(false);
  const [inputName, setInputName] = useState<string>('');
  const [inputImage, setInputImage] = useState<string>('');
  const [inputBirth, setInputBirth] = useState<string>('');
  const [inputPhoneNumber, setInputPhoneNumber] = useState<string>('');

  useEffect(() => {
    const fetchProfileInfo = async () => {
      const response = await getMyProfile();
      const data = response.data.data;

      setType(data.userType);
      setInputName(data.name);
      setInputImage(data.profileImage);
    };
    fetchProfileInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isValid =
      inputName.trim().length > 0 &&
      inputImage.trim().length > 0 &&
      inputBirth.length === 10 &&
      inputPhoneNumber.length === 13;

    setValid(isValid);
  }, [inputName, inputImage, inputBirth, inputPhoneNumber]);

  const handleNextPage = async () => {
    const { status } = await patchUserEdit({
      profileImage: inputImage,
      name: inputName,
      birth: inputBirth,
      phoneNumber: inputPhoneNumber,
    });

    if (status === HTTP_STATUS.OK) {
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

  const handleInputBirth = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // 숫자만 남김

    if (value.length > 8) value = value.slice(0, 8);

    if (value.length >= 7) {
      value = `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6)}`;
    } else if (value.length >= 5) {
      value = `${value.slice(0, 4)}.${value.slice(4)}`;
    } else {
      value = value;
    }

    setInputBirth(value);
  };

  const handleInputPhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 11) value = value.slice(0, 11);

    if (value.length >= 8) {
      value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
    } else if (value.length >= 4) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    }

    setInputPhoneNumber(value);
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
        <input
          type="text"
          value={inputBirth}
          onChange={handleInputBirth}
          inputMode="numeric"
          placeholder="생년월일 ex) 1995.09.13"
          className={styles.input}
        />

        <input
          type="tel"
          value={inputPhoneNumber}
          onChange={handleInputPhoneNumber}
          inputMode="numeric"
          placeholder="전화번호 ex) 010-1234-5678"
          className={styles.input}
        />
      </div>
      <div className={styles.profile_setting_footer}>
        <div className={styles.button_wrapper}>
          <button
            className={`${styles.select_button} ${valid ? styles.active : ''}`}
            onClick={handleNextPage}>
            {valid ? TEXT.COMMON.done : TEXT.COMMON.next}
          </button>
        </div>
      </div>
    </>
  );
}
