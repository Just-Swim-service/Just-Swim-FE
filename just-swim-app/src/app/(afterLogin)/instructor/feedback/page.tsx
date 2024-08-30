'use client';

import { InstructorBottomNavBar, ProfileHeader } from '@components';

import { FeedbackList, FeedbackTypeButton } from './_components';
import styled from './feedback.module.scss';
import { List } from './_components';
import { getSortedFeedback } from '@apis';
// import { getCachedSortedFeedback } from './server';

export default async function Feedback() {
  const data = {
    name: '강사',
    image: '',
  };

  const cachedFeedbackList = (await getSortedFeedback()) || [];

  return (
    <div className={styled.layout}>
      <ProfileHeader leftContent="피드백" data={data} />
      <FeedbackTypeButton />
      {/* <FeedbackList /> */}
      <List feedback={cachedFeedbackList} />
      <div className={styled.nav}>
        <InstructorBottomNavBar />
      </div>
    </div>
  );
}
