'use client';

import { ProfileHeader } from '@components';

import { FeedbackList, FeedbackTypeButton } from './_components';
import styled from './feedback.module.scss';
// import { Get } from '@/_apis/feedback/route';

export default async function FeedbackView() {
  // const FeedbackList = await Get();
  // console.log(FeedbackList);

  const data = {
    name: '강사',
    image: '',
  };

  return (
    <div className={styled.layout}>
      <ProfileHeader leftContent="피드백" data={data} />
      <FeedbackTypeButton />
      <FeedbackList />
    </div>
  );
}