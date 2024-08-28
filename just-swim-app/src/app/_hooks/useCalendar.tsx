import { useCallback, useState } from "react";

import { numberFormat, randomId } from "@utils";

const date = new Date();
const utc = date.getTime() + (date.getTimezoneOffset() * 60 * 1000);
const kstGap = 9 * 60 * 60 * 1000;
const today = new Date(utc + kstGap);

const regexp = /[0-9]{4}.[0-9]{2}.[0-9]{2}/g;

const calculatePrevMonth = (startDay: Date) => {
  const prevDate = startDay.getDate();
  const prevDay = startDay.getDay();

  const days = [];

  for (let i = prevDate - prevDay; i <= prevDate; i++) {
    days.push(i);
  }

  if (days.length !== 7) {
    return days;
  } else {
    return [];
  }
}

const calculateThisMonth = (endDay: Date) => {
  const nextDate = endDay.getDate();

  const days = [];

  for (let i = 1; i <= nextDate; i++) {
    days.push(i);
  }

  return days;
}

const calculateNextMonth = (endDay: Date) => {
  const nextDay = endDay.getDay();

  const days = [];

  for (let i = 1; i <= (7 - (nextDay + 1) == 7 ? 0 : 7 - (nextDay + 1)); i++) {
    days.push(i);
  }
  
  return days;
}

export function useCalendar({
  CalendarItem,
  initialDate = '',
}: {
  CalendarItem: JSX.ElementType,
  initialDate?: string,
}): {
  days: JSX.Element[],
  currentYear: number,
  currentMonth: number,
  selectedDate: string,
  setYear: (year: number) => void,
  setMonth: (month: number) => void,
  setPrevMonth: () => void,
  setNextMonth: () => void,
} {
  const validInput = regexp.test(initialDate);
  const [inputYear, inputMonth, inputDate] = initialDate.split(".").map(Number);

  const [current, setCurrent] = useState<{
    year: number,
    month: number,
  }>({
    year: validInput ? inputYear : today.getFullYear(),
    month: validInput ? inputMonth - 1 : today.getMonth(),
  });

  const [selected, setSelected] = useState<{
    year: number,
    month: number,
    day: number,
  }>({
    year: validInput ? inputYear : today.getFullYear(),
    month: validInput ? inputMonth - 1 : today.getMonth(),
    day: validInput ? inputDate : today.getDate(),
  });

  const startDay = new Date(current.year, current.month, 0);
  const endDay = new Date(current.year, current.month + 1, 0);

  const changeSelected = (day: number) => {
    setSelected({
      year: current.year,
      month: current.month,
      day: day,
    })
  }

  const days = [
    ...calculatePrevMonth(startDay).map(day => {
      return (
        <div key={randomId()}>
          <CalendarItem
            year={current.year}
            month={current.month - 1}
            date={day}
            isDisabled={true}
            isToday={false}
            isSelected={false}
          />
        </div>
      )
    }),
    ...calculateThisMonth(endDay).map(day => {
      return (
        <div key={randomId()} onClick={() => {changeSelected(day)}}>
          <CalendarItem
            year={current.year}
            month={current.month}
            date={day}
            isDisabled={false}
            isToday={current.year === today.getFullYear() && current.month === today.getMonth() && day === today.getDate()}
            isSelected={current.year === selected.year && current.month === selected.month && day === selected.day}
          />
        </div>
      )
    }),
    ...calculateNextMonth(endDay).map(day => {
      return (
        <div key={randomId()}>
          <CalendarItem
            year={current.year}
            month={current.month + 1}
            date={day}
            isDisabled={true}
            isToday={false}
            isSelected={false}
          />
        </div>
      )
    }),
  ];

  const setYear = useCallback((year: number) => {
    setCurrent(prev => ({
      ...prev,
      year,
    }));
  }, []);

  const setMonth = useCallback((month: number) => {
    setCurrent(prev => ({
      ...prev,
      month,
    }));
  }, []);

  const setPrevMonth = useCallback(() => {
    setCurrent(prev => ({
      ...prev,
      month: prev.month - 1 
    }));
  }, []);

  const setNextMonth = useCallback(() => {
    setCurrent(prev => ({
      ...prev,
      month: prev.month + 1 
    }));
  }, [])

  return {
    days,
    currentYear: current.year,
    currentMonth: current.month,
    selectedDate: `${numberFormat(selected.year)}.${numberFormat(selected.month + 1)}.${numberFormat(selected.day)}`,
    setYear,
    setMonth,
    setPrevMonth,
    setNextMonth,
  };
}