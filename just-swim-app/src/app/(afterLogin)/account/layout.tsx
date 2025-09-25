'use client';

import { usePathname, useRouter } from 'next/navigation';
import styles from './layout.module.scss';

import { IconArrowLeft } from '@assets';
import React, { useEffect, useState } from 'react';
import { patchUserEdit, revalidateMyProfile, getMyProfile } from '@apis';
import { HTTP_STATUS, ROUTES, TEXT } from '@data';
import { ProfileEditCompleteToast } from '@components';
import { AccountContext } from './_context/context';
import { useUserStore } from '@store';
import Cookies from 'js-cookie';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const param = usePathname();
  const { setProfileInfo, invalidateProfile } = useUserStore();

  const [token, setToken] = useState<string | boolean>();
  const [show, setShow] = useState<boolean>(false);
  const [editable, setEditable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [userBirth, setUserBirth] = useState<string>('');
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>('');
  const [userType, setUserType] = useState<string>('');
  const [profileImage, setProfileImage] = useState<{
    fileName?: string | undefined;
    fileType?: string | undefined;
    fileURL?: string | undefined;
  }>({ fileName: undefined, fileType: undefined, fileURL: undefined });

  // 강사 전용 상태
  const [instructorIntroduction, setInstructorIntroduction] =
    useState<string>('');
  const [instructorExperience, setInstructorExperience] = useState<string>('');
  const [instructorSpecialties, setInstructorSpecialties] = useState<string[]>(
    [],
  );
  const [instructorCertifications, setInstructorCertifications] = useState<
    string[]
  >([]);

  // 고객 전용 상태
  const [customerSwimmingLevel, setCustomerSwimmingLevel] = useState<string>('');
  const [customerPreferredStyles, setCustomerPreferredStyles] = useState<
    string[]
  >([]);
  const [customerAllergies, setCustomerAllergies] = useState<string>('');
  const [customerEmergencyContact, setCustomerEmergencyContact] =
    useState<string>('');

  useEffect(() => {
    const getToken = async () => {
      const token = Cookies.get('authorization');
      setToken(token);
    };
    getToken();
  }, []);

  const showToast = () => {
    setShow(true);
  };

  const unshowToast = () => {
    setShow(false);
  };

  const handleEditProfile = async () => {
    if (isLoading) return; // 중복 클릭 방지

    setIsLoading(true);

    try {
      const data = await patchUserEdit({
        profileImage: profileImage.fileURL,
        name: userName,
        birth: userBirth,
        phoneNumber: userPhoneNumber,
      });

      if (data.status === HTTP_STATUS.OK) {
        await revalidateMyProfile();

        // 서버에서 최신 프로필 정보를 가져와서 스토어 업데이트
        try {
          const latestProfile = await getMyProfile();
          const profileData = latestProfile.data.data;

          // 로컬 스토리지의 user-store 업데이트
          setProfileInfo(profileData);

          setEditable(false);
          showToast();
          router.replace(ROUTES.ACCOUNT.root);
        } catch (error) {
          console.error('프로필 정보 업데이트 실패:', error);
          // 에러가 발생해도 기본 동작은 수행
          setEditable(false);
          showToast();
          router.replace(ROUTES.ACCOUNT.root);
        }
      }
    } catch (error) {
      console.error('프로필 수정 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPage = () => {
    router.back();
  };

  return (
    <div className={styles.account}>
      <div className={styles.account_header}>
        <div className={styles.content}>
          <div className={styles.back_link} onClick={handleBackPage}>
            <IconArrowLeft width={20} height={20} fill="#050606" />
            <p>
              {param === ROUTES.ACCOUNT.root ? TEXT.ACCOUNT_PAGE.myInfo : ''}
              {param === ROUTES.ACCOUNT.edit
                ? TEXT.ACCOUNT_PAGE.editInfoTitle
                : ''}
              {param === '/account/deletion' ? '탈퇴하기' : ''}
            </p>
          </div>
          {param === ROUTES.ACCOUNT.edit ? (
            <button
              className={`${styles.edit_link} ${editable ? styles.abled : styles.disabled} ${isLoading ? styles.loading : ''}`}
              onClick={handleEditProfile}
              disabled={!editable || isLoading}>
              {isLoading ? '저장 중...' : TEXT.COMMON.done}
            </button>
          ) : null}
          {param === '/account/deletion' ? (
            <div
              className={`${styles.edit_link} ${editable ? styles.abled : styles.disabled}`}></div>
          ) : null}
        </div>
      </div>
      <AccountContext.Provider
        value={{
          userToken: token ?? false,
          editable: editable,
          userName: userName,
          userBirth: userBirth,
          userPhoneNumber: userPhoneNumber,
          userType: userType as any,
          profileImage: profileImage ?? {
            fileName: undefined,
            fileType: undefined,
            fileURL: undefined,
          },
          // 강사 전용 필드
          instructorIntroduction: instructorIntroduction,
          instructorExperience: instructorExperience,
          instructorSpecialties: instructorSpecialties,
          instructorCertifications: instructorCertifications,
          // 고객 전용 필드
          customerSwimmingLevel: customerSwimmingLevel,
          customerPreferredStyles: customerPreferredStyles,
          customerAllergies: customerAllergies,
          customerEmergencyContact: customerEmergencyContact,

          setEditable: setEditable,
          setUserName: setUserName,
          setUserBirth: setUserBirth,
          setUserPhoneNumber: setUserPhoneNumber,
          setUserType: setUserType as any,
          setProfileImage: setProfileImage,
          // 강사 전용 setter
          setInstructorIntroduction: setInstructorIntroduction,
          setInstructorExperience: setInstructorExperience,
          setInstructorSpecialties: setInstructorSpecialties,
          setInstructorCertifications: setInstructorCertifications,
          // 고객 전용 setter
          setCustomerSwimmingLevel: setCustomerSwimmingLevel,
          setCustomerPreferredStyles: setCustomerPreferredStyles,
          setCustomerAllergies: setCustomerAllergies,
          setCustomerEmergencyContact: setCustomerEmergencyContact,
        }}>
        {children}
        {show && <ProfileEditCompleteToast unshowToast={unshowToast} />}
      </AccountContext.Provider>
    </div>
  );
}
