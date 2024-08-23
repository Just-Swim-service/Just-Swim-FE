import { Suspense } from "react";
import {
  ScheduleHeaderLayout,
  ScheduleCommonLayout,
  ScheduleNavLayout,
  ScheduleAddButton,
} from "./_components";

export default function Layout({
  children
}: {
  children?: React.ReactNode,
}) {
  return (
    <div>
      <ScheduleHeaderLayout />
      <ScheduleCommonLayout />
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
      <ScheduleNavLayout />
      <ScheduleAddButton />
    </div>
  )
}