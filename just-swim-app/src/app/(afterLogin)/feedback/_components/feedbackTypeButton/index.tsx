'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { searchClassStore, searchUserStore, useUserStore } from '@store';
import FeedbackTypeButtonGroup from '@assets/feedback_type_button_group.svg';
import FeedbackTypeButtonPersonal from '@assets/feedback_type_button_personal.svg';

import styled from './feedbackTypeButton.module.scss';
import { feedbackStore } from '@/_store/feedback';
import { getMyProfile } from '@apis';
import { trim } from 'lodash';

export function FeedbackTypeButton({ token }: { token: string }) {
  const router = useRouter();
  const { getUserType, getUser, setAddUserProfile, setAddUserToken } =
    useUserStore();
  const { resetFeedbackFormData } = feedbackStore();
  const { resetClassData } = searchClassStore();
  const { resetMemberData } = searchUserStore();
  const [type, setType] = useState<string>('');

  const setUserData = useCallback(async () => {
    try {
      const { status, data } = await getMyProfile();
      if (status === 406) {
        setAddUserToken('');
        return router.replace('/signin');
      }
      setAddUserProfile({ token: token, profile: data?.data });
    } catch (error) {
      setAddUserToken('');
      return router.replace('/signin');
    }
  }, [setAddUserProfile, setAddUserToken, token, router]);

  useEffect(() => {
    const user = getUser();

    if (Object.keys(user).length === 0 || !user) {
      setUserData().then(() => {
        setType(trim(getUserType(token)));
      });
    } else {
      setType(trim(getUserType(token)));
    }
  }, [getUser, getUserType, setUserData, token]);

  const handleIndividualClick = (feedbackType: string) => {
    resetFeedbackFormData();
    resetClassData();
    resetMemberData();
    router.push(`feedback/create/${feedbackType}`);
  };

  return (
    <>
      {type === 'instructor' && (
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
