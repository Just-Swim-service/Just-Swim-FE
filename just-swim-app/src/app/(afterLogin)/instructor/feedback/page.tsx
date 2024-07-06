'use client';

import { InstructorBottomNavBar, ProfileHeader } from '@components';

import { FeedbackList, FeedbackTypeButton } from './_components';
import styled from './feedback.module.scss';

export default async function Feedback() {
  const data = {
    name: '강사',
    image: '',
  };

  return (
    <div className={styled.layout}>
      <ProfileHeader leftContent="피드백" data={data} />
      <FeedbackTypeButton />
      <FeedbackList />
      <div className={styled.nav}>
        <InstructorBottomNavBar />
      </div>
    </div>
  );
}
