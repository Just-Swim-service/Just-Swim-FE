'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { searchClassStore, searchUserStore, useUserStore } from '@store';
import FeedbackTypeButtonGroup from '@assets/feedback_type_button_group.svg';
import FeedbackTypeButtonPersonal from '@assets/feedback_type_button_personal.svg';

import styled from './feedbackTypeButton.module.scss';
import { feedbackStore } from '@/_store/feedback';
import { getCachedMyProfile } from '@apis';

type ProfileInfo = {
  name: string;
  profileImage: string;
  userType: string;
};

export function FeedbackTypeButton({ token }: { token: string }) {
  const router = useRouter();
  const { resetFeedbackFormData } = feedbackStore();
  const { resetClassData } = searchClassStore();
  const { resetMemberData } = searchUserStore();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>();

  useEffect(() => {
    const fetchProfileInfo = async () => {
      const response = await getCachedMyProfile();
      setProfileInfo(response as ProfileInfo);
    };
    fetchProfileInfo();
  }, []);

  const handleIndividualClick = (feedbackType: string) => {
    resetFeedbackFormData();
    resetClassData();
    resetMemberData();
    router.push(`feedback/create/${feedbackType}`);
  };

  return (
    <>
      {profileInfo?.userType === 'instructor' && (
        <div className={styled.button_box}>
          <button
            onClick={() => handleIndividualClick('person')}
            className={styled.button_person}>
            <FeedbackTypeButtonPersonal className={styled.icon} />
            <p className={styled.button_title}>
              <span>개별</span>
              <br />
              피드백 남기기
            </p>
            <p className={styled.button_desc}>개인 작성에 유용합니다.</p>
          </button>
          <button
            onClick={() => handleIndividualClick('class')}
            className={styled.button_class}>
            <FeedbackTypeButtonGroup className={styled.icon} />
            <p className={styled.button_title}>
              <span>반별</span>
              <br />
              피드백 남기기
            </p>
            <p className={styled.button_desc}>단체 작성에 유용합니다.</p>
          </button>
        </div>
      )}
    </>
  );
}
