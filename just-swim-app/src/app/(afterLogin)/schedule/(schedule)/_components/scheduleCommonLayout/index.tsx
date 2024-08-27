import { getTodayScheduleCount } from "@utils";

import { ScheduleCommon } from "../scheduleCommon";

export async function ScheduleCommonLayout() {
  const todayCount = await getTodayScheduleCount();

  return (
    <>
      <ScheduleCommon count={todayCount} />
    </>
  )
}