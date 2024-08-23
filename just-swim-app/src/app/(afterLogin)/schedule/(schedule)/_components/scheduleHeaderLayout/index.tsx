import { getCachedMyProfile } from "@apis";

import { ScheduleHeader } from "../scheduleHeader";

export async function ScheduleHeaderLayout() {
  const profileInfo = await getCachedMyProfile();
  
  return (
    <>
      <ScheduleHeader image={profileInfo?.profileImage} />
    </>
  )
}