import { getCachedWeeklyScheduleInfo } from '@utils';
import { WeekWrapper } from './_components';

export default async function Weekly() {
  try {
    const weeklyInfo = await getCachedWeeklyScheduleInfo();
    return <WeekWrapper weeklyInfo={weeklyInfo} />;
  } catch (error) {
    console.error('Weekly 스케줄 렌더링 중 에러:', error);
    throw error; // error.tsx로 전달
  }
}
