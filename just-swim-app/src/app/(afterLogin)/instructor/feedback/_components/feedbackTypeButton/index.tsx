'use client';

import { useRouter } from 'next/navigation';

import styled from './feedbackTypeButton.module.scss';

export function FeedbackTypeButton() {
  const router = useRouter();
  const handleIndividualClick = (type: string) => {
    router.push(`feedback/create/${type}`);
  };

  return (
    <>
      <div className={styled.button_box}>
        <button onClick={() => handleIndividualClick('person')}>
          <p>
            <span>개별</span>
            <br />
            피드백 남기기
          </p>
        </button>
        <button onClick={() => handleIndividualClick('class')}>
          <p>
            <span>반별</span>
            <br />
            피드백 남기기
          </p>
        </button>
      </div>
    </>
  );
}