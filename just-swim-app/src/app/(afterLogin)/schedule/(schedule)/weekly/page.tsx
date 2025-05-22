import { getWeeklyScheduleInfo } from '@utils';
import { WeekWrapper } from './_components';

export default async function Weekly() {
  const weeklyInfo = await getWeeklyScheduleInfo();
  console.log(weeklyInfo);

  return <WeekWrapper weeklyInfo={weeklyInfo} />;
}
