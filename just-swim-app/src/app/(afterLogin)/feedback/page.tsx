import { BottomNav, UserIconHeader } from '@components';

import { getSortedFeedback } from '@apis';

import { FeedbackTypeButton, List } from './_components';

import styled from './feedback.module.scss';

export default async function Feedback() {
  const feedbackList = (await getSortedFeedback()) || [];

  return (
    <div className={styled.layout}>
      <UserIconHeader title="피드백" />
      <FeedbackTypeButton />
      <List feedback={feedbackList} />
      <BottomNav />
    </div>
  );
}
