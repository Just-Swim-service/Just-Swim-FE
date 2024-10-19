import { getCachedWeeklyScheduleInfo, getTokenInCookies } from "@utils";

import { WeekWrapper } from "./_components";

export default async function Weekly() {
  const weeklyInfo = await getCachedWeeklyScheduleInfo();
  const token = await getTokenInCookies();

  return (
    <WeekWrapper weeklyInfo={weeklyInfo} token={token} />
  )
}