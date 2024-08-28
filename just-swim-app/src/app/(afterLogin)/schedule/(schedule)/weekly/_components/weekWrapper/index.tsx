'use client';

import { Suspense, useState } from "react";

import { LectureProps } from "@types";

import { WeekInfo } from "../weekInfo";
import { ClassList } from "../classList";

export function WeekWrapper({
  weeklyInfo,
}: {
  weeklyInfo: { date: string, day: string, lectures: LectureProps[] }[],
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
        />
      </Suspense>
    </>
  )
}