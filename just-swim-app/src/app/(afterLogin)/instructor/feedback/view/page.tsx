'use client';

import { ProfileHeader } from '@components';

import { FeedbackList, FeedbackTypeButton } from './_components';

export default function view() {
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
