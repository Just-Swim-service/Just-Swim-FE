'use client';

import { HTMLAttributes, useCallback, useEffect, useMemo, useState } from "react";

import { getCachedMonthlyScheduleInfo, getToday, getWeekNumber, numberFormat, randomId } from "@utils";
import { CalendarItemProps, ScheduleSummary } from "@types";
import { useCalendar } from "@hooks";

import { MonthlyCalendar } from "../monthlyCalendar";
import { ClassList } from "../classList";
import { MonthlyInfo } from "../monthlyInfo";

import styled from './styles.module.scss';

const itemHeight = 70;

export function MonthlyWrapper() {
  const [monthlyInfo, setMonthlyInfo] = useState<ScheduleSummary[] | []>([]);
  const [show, setShow] = useState<boolean>(false);
  const [y, setY] = useState<number>(0);

  const today = useMemo(() => getToday(), []);
  
  const ClassCalendarItem = useCallback(({
    year = today.getFullYear(),
    month = today.getMonth(),
    date,
    isDisabled,
    isToday,
    isSelected,
    ...props
  }: CalendarItemProps & HTMLAttributes<HTMLButtonElement>) => {
    const nowDate = `${numberFormat(year)}.${numberFormat(month + 1)}.${numberFormat(date)}`;
    const nowDateInfo = monthlyInfo.filter(info => info.date === nowDate)[0];

    return (
      <>
        <button
          className={`${styled.days} ${isDisabled && styled.disabled} ${isToday && styled.today} ${isSelected && styled.selected}`}
          {...props}
        >
          {date}
        </button>
        {
          nowDateInfo &&
          <div className={styled.dot_wrapper}>
            <div key={randomId()} className={styled.count}>
              {
                nowDateInfo.lectures.map((schedule, index) => {
                  if (index >= 5) {
                    return null;
                  }

                  return (
                    <div
                      key={randomId()}
                      className={styled.dot}
                      style={{
                        backgroundColor: new Date(nowDate) < today || isDisabled ? '' : schedule.lectureColor 
                      }}
                    />
                  )
                })
              }
            </div>
          </div>
        }
      </>
    )
  }, [monthlyInfo, today]);

  useEffect(() => {
    if (show) {
      return;
    }

    setY(0);
  }, [show]);

  const {
    days,
    currentYear,
    currentMonth,
    selectedDate,
    setYear,
    setMonth,
  } = useCalendar({
    CalendarItem: ClassCalendarItem,
  });
  
  useEffect(() => {
    const getMonthInfo = async () => {
      const result = await getCachedMonthlyScheduleInfo(`${currentYear}.${currentMonth + 1}`);

      setMonthlyInfo(result);
    }

    getMonthInfo();
    setShow(false);
  }, [currentYear, currentMonth]);

  useEffect(() => {
    let selectedWeekNumber = getWeekNumber(new Date(selectedDate)) - 2;
  
    if (selectedWeekNumber < 0) {
      selectedWeekNumber = 0;
    }

    setY(selectedWeekNumber * -itemHeight);
    setShow(true);
  }, [selectedDate]);

  const unshowClass = () => {
    setShow(false);
  }

  return (
    <div className={styled.container}>
      <MonthlyInfo 
        currentYear={currentYear}
        currentMonth={currentMonth}
        setYear={setYear}
        setMonth={setMonth}
      />
      <MonthlyCalendar
        days={days}
        itemHeight={itemHeight}
        y={y}
      />
      {
        show &&
        <ClassList
          selectedDate={selectedDate}
          monthlyInfo={monthlyInfo}
          itemHeight={itemHeight}
          unshowClass={unshowClass}
        />
      }
    </div>
  )
}