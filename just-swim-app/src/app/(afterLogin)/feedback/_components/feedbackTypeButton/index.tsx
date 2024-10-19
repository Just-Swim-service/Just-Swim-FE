'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useUserStore } from '@store';

import styled from './feedbackTypeButton.module.scss';

export function FeedbackTypeButton({
  token
}: {
  token: string,
}) {
  const [mounted, setMounted] = useState<boolean>(false);

  const { getUserType } = useUserStore();

  const type = useRef<string>(getUserType(token));

  const router = useRouter();

  const handleIndividualClick = (type: string) => {
    router.push(`feedback/create/${type}`);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  console.log(type.current);
  

  return (
    <>
      {
        mounted && type.current === 'instructor' &&
        <div className={styled.button_box}>
          <button onClick={() => handleIndividualClick('person')}>
            <p className={styled.button_title}>
              <span>개별</span>
              <br />
              피드백 남기기
            </p>
            <p className={styled.button_desc}>개인 작성에 유용합니다.</p>
          </button>
          <button onClick={() => handleIndividualClick('class')}>
            <p className={styled.button_title}>
              <span>반별</span>
              <br />
              피드백 남기기
            </p>
            <p className={styled.button_desc}>단체 작성에 유용합니다.</p>
          </button>
        </div>
      }
      
    </>
  );
}