import { Suspense } from "react";

import {
  ScheduleCommonLayout,
  ScheduleAddButton,
} from "./_components";
import { UserIconHeader, BottomNav } from "@components";
import { getTokenInCookies } from "@utils";

export default async function Layout({
  children
}: {
  children?: React.ReactNode,
}) {
  const token = await getTokenInCookies();

  return (
    <div>
      <UserIconHeader title="" />
      <ScheduleCommonLayout />
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
      <BottomNav />
      <ScheduleAddButton token={token} />
    </div>
  )
}