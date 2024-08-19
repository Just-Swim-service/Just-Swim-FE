import { getCachedWeeklyScheduleInfo } from "@utils";

import { WeekWrapper } from "./_components";

export default async function Weekly() {
  const weeklyInfo = await getCachedWeeklyScheduleInfo();

  return (
    <WeekWrapper weeklyInfo={weeklyInfo} />
  )
}