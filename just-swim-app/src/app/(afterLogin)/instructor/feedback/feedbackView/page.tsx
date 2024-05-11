'use client';

import FeedbackList from './_components/feedbackList/page';
import FeedbackTypeButton from './_components/feedbackTypeButton/page';

export default function FeedbackView() {
  return (
    <>
      <FeedbackTypeButton />
      <FeedbackList />
    </>
  );
}
