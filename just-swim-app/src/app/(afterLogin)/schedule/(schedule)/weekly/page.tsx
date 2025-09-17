import { getWeeklyScheduleInfo } from '@utils';
import { WeekWrapper } from './_components';

export default async function Weekly() {
  console.log('🔔 [Weekly Page] 페이지 렌더링 시작');

  try {
    console.log('🔔 [Weekly Page] getWeeklyScheduleInfo 호출');
    const weeklyInfo = await getWeeklyScheduleInfo();
    console.log('🔔 [Weekly Page] weeklyInfo 결과:', weeklyInfo);

    return <WeekWrapper weeklyInfo={weeklyInfo} />;
  } catch (error) {
    console.error('🔔 [Weekly Page] 에러 발생:', error);
    throw error;
  }
}
