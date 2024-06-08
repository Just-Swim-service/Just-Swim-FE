'use client';

import ProfileHeader from '@/app/_component/header/ProfileHeader';
import FeedbackList from './_components/feedbackList/page';
import FeedbackTypeButton from './_components/feedbackTypeButton/page';

export default function FeedbackView() {
  const data = {
    name: '강사',
    image: '',
  };

  return (
    <>
      <ProfileHeader leftContent="피드백" data={data} />
      <FeedbackTypeButton />
      <FeedbackList />
    </>
  );
}
