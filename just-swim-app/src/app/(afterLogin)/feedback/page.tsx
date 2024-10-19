import { BottomNav, UserIconHeader } from '@components';

import { searchClassStore, searchUserStore } from '@store';
import { getSortedFeedback } from '@apis';
import { getTokenInCookies } from '@utils';

import { FeedbackTypeButton, List } from './_components';

import styled from './feedback.module.scss';

// import { getCachedSortedFeedback } from './server';

export default async function Feedback() {
  // 피드백 작성중 페이지 이탈한 경우 store reset
  // @ts-ignore
  // const { reset } = searchClassStore();
  // // const { reset } = searchUserStore();
  // useEffect(() => {
  //   reset();
  // }, []);

  const cachedFeedbackList = (await getSortedFeedback()) || [];
  const token = await getTokenInCookies();

  return (
    <div className={styled.layout}>
      <UserIconHeader title="피드백" />
      <FeedbackTypeButton token={token} />
      {/* <FeedbackList /> */}
      <List feedback={cachedFeedbackList} token={token} />
      <BottomNav />
    </div>
  );
}
