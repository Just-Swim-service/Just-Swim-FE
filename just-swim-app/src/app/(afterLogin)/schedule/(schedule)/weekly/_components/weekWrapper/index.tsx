'use client';

import { Suspense, useState } from "react";

import { LectureProps } from "@types";

import { WeekInfo } from "../weekInfo";
import { ClassList } from "../classList";

export function WeekWrapper({
  weeklyInfo,
  token
}: {
  weeklyInfo: { date: string, day: string, lectures: LectureProps[] }[],
  token: string,
}) {
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDay());
  
  return (
    <>
      <WeekInfo
        weeklyInfo={weeklyInfo}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <Suspense fallback={<>loading...</>}>
        <ClassList
          weeklyInfo={weeklyInfo}
          selectedDate={selectedDate}
          token={token}
        />
      </Suspense>
    </>
  )
}