'use client';

import { useRouter } from 'next/navigation';
import styled from './feedbackTypeButton.module.scss';

export default function FeedbackTypeButton() {
  const router = useRouter();
  const handleIndividualClick = () => {
    router.push('');
  };

  const handleGroupClick = () => {
    router.push('');
  };

  return (
    <>
      <div className={styled.button_box}>
        <button onClick={handleIndividualClick}>
          <p>
            <span>개별</span>
            <br />
            피드백 남기기
          </p>
        </button>
        <button onClick={handleGroupClick}>
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
