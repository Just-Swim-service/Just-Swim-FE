'use client';

import React, { useEffect } from 'react';
import styles from './pages.module.scss';
import { useRouter } from 'next/navigation';

import { IconGallery, IconInputValid } from '@assets';
import { URLImage } from '@components';
import { ROUTES, TEXT } from '@data';
import { AccountContext } from '../_context/context';
import { getMyProfile, getProfilePresignedURL } from '@apis';

export default function Account() {
  const router = useRouter();

  const accountContextData = React.useContext(AccountContext);
  const {
    editable,
    userName,
    userBirth,
    userPhoneNumber,
    userType,
    profileImage,
    // 강사 전용 필드
    instructorIntroduction,
    instructorExperience,
    instructorSpecialties,
    instructorCertifications,
    // 고객 전용 필드
    customerSwimmingLevel,
    customerPreferredStyles,
    customerAllergies,
    customerEmergencyContact,

    setEditable,
    setUserName,
    setUserBirth,
    setUserPhoneNumber,
    setUserType,
    setProfileImage,
    // 강사 전용 setter
    setInstructorIntroduction,
    setInstructorExperience,
    setInstructorSpecialties,
    setInstructorCertifications,
    // 고객 전용 setter
    setCustomerSwimmingLevel,
    setCustomerPreferredStyles,
    setCustomerAllergies,
    setCustomerEmergencyContact,
  } = accountContextData;

  useEffect(() => {
    const init = async () => {
      try {
        const data = await getMyProfile();
        const profile = data.data.data;
        setUserName(profile.name);
        setUserBirth(profile.birth || '');
        setUserPhoneNumber(profile.phoneNumber || '');
        setUserType(profile.userType);
        setProfileImage({ fileURL: profile.profileImage });

        // 사용자 타입별 초기 데이터 설정 (실제 API에서 받아올 데이터)
        // TODO: 실제 API에서 받아온 데이터로 초기화
        if (profile.userType === 'instructor') {
          setInstructorIntroduction('');
          setInstructorExperience('');
          setInstructorSpecialties([]);
          setInstructorCertifications([]);
        } else if (profile.userType === 'customer') {
          setCustomerSwimmingLevel('');
          setCustomerPreferredStyles([]);
          setCustomerAllergies('');
          setCustomerEmergencyContact('');
        }
      } catch (error) {
        router.push(ROUTES.ONBOARDING.signin);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUserName = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(evt.target.value);
    handleSetEditableTrue();
  };

  const handleProfileImage = async (
    evt: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = evt.target.files?.[0];
    const presignedURL = await getProfilePresignedURL(file?.name as string);
    if (!presignedURL) {
      throw new Error('Presigned URL을 가져오지 못했습니다.');
    }

    const response = await fetch(presignedURL as any, {
      method: 'PUT',
      body: file,
      headers: file?.type
        ? {
            'Content-Type': file.type,
          }
        : undefined,
    });
    if (!response.ok) {
      throw new Error('파일 업로드 실패');
    }

    const imageData = {
      fileURL: presignedURL.toString().split('?')[0], // URL에서 쿼리스트링 제거
      fileName: file?.name,
      fileType: file?.type,
    };

    setProfileImage(imageData as any); // 타입 강제 캐스팅 불필요
    handleSetEditableTrue();
  };

  const handleUserBirth = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // 숫자만 남김

    if (value.length > 8) value = value.slice(0, 8);

    if (value.length >= 7) {
      value = `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6)}`;
    } else if (value.length >= 5) {
      value = `${value.slice(0, 4)}.${value.slice(4)}`;
    }

    setUserBirth(value);
    handleSetEditableTrue();
  };

  const handleUserPhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 11) value = value.slice(0, 11);

    if (value.length >= 8) {
      value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
    } else if (value.length >= 4) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    }

    setUserPhoneNumber(value);
    handleSetEditableTrue();
  };

  const handleSetEditableTrue = () => {
    if (!editable) {
      setEditable(true);
    }
  };

  return (
    <>
      <div className={styles.account_section}>
        <div className={styles.account_image_wrapper}>
          <div className={styles.account_img}>
            <URLImage
              imageURL={profileImage.fileURL ?? ''}
              alt="profile image"
            />
          </div>
          <label htmlFor="select_image" className={styles.image_button}>
            <IconGallery />
            <div>
              <input
                type="file"
                id="select_image"
                accept="image/*"
                onChange={handleProfileImage}
                className={styles.input_file}
              />
            </div>
          </label>
        </div>
        <div className={styles.name_input_wrapper}>
          <p className={styles.name_title}>{TEXT.ACCOUNT_PAGE.name}</p>
          <div className={styles.input_wrapper}>
            <input
              type="text"
              value={userName}
              onChange={handleUserName}
              className={styles.name_input}
            />
            {editable && <IconInputValid width={18} height={18} />}
          </div>
        </div>
        <div className={styles.birth_input_wrapper}>
          <p className={styles.birth_title}>생년월일</p>
          <div className={styles.input_wrapper}>
            <input
              type="text"
              value={userBirth}
              onChange={handleUserBirth}
              placeholder="생년월일 ex) 1995.09.13"
              className={styles.birth_input}
            />
            {editable && <IconInputValid width={18} height={18} />}
          </div>
        </div>
        <div className={styles.phone_input_wrapper}>
          <p className={styles.phone_title}>전화번호</p>
          <div className={styles.input_wrapper}>
            <input
              type="tel"
              value={userPhoneNumber}
              onChange={handleUserPhoneNumber}
              placeholder="전화번호 ex) 010-1234-5678"
              className={styles.phone_input}
            />
            {editable && <IconInputValid width={18} height={18} />}
          </div>
        </div>

        {/* 사용자 타입별 추가 필드 */}
        {userType === 'instructor' && (
          <>
            <div className={styles.introduction_input_wrapper}>
              <p className={styles.introduction_title}>강사 소개</p>
              <div className={styles.input_wrapper}>
                <textarea
                  value={instructorIntroduction}
                  onChange={(e) => {
                    setInstructorIntroduction(e.target.value);
                    handleSetEditableTrue();
                  }}
                  placeholder="자신을 소개해주세요"
                  className={styles.introduction_textarea}
                  rows={3}
                />
                {editable && <IconInputValid width={18} height={18} />}
              </div>
            </div>

            <div className={styles.experience_input_wrapper}>
              <p className={styles.experience_title}>경력 (년수)</p>
              <div className={styles.input_wrapper}>
                <input
                  type="text"
                  value={instructorExperience}
                  onChange={(e) => {
                    setInstructorExperience(e.target.value);
                    handleSetEditableTrue();
                  }}
                  placeholder="예) 5년"
                  className={styles.experience_input}
                />
                {editable && <IconInputValid width={18} height={18} />}
              </div>
            </div>
          </>
        )}

        {userType === 'customer' && (
          <>
            <div className={styles.swimming_level_wrapper}>
              <p className={styles.swimming_level_title}>수영 실력 레벨</p>
              <div className={styles.input_wrapper}>
                <select
                  value={customerSwimmingLevel}
                  onChange={(e) => {
                    setCustomerSwimmingLevel(e.target.value);
                    handleSetEditableTrue();
                  }}
                  className={styles.swimming_level_select}>
                  <option value="">선택해주세요</option>
                  <option value="beginner">초급</option>
                  <option value="intermediate">중급</option>
                  <option value="advanced">고급</option>
                </select>
                {editable && <IconInputValid width={18} height={18} />}
              </div>
            </div>

            <div className={styles.allergies_input_wrapper}>
              <p className={styles.allergies_title}>알레르기/주의사항</p>
              <div className={styles.input_wrapper}>
                <textarea
                  value={customerAllergies}
                  onChange={(e) => {
                    setCustomerAllergies(e.target.value);
                    handleSetEditableTrue();
                  }}
                  placeholder="알레르기나 특별한 주의사항이 있다면 적어주세요"
                  className={styles.allergies_textarea}
                  rows={2}
                />
                {editable && <IconInputValid width={18} height={18} />}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
