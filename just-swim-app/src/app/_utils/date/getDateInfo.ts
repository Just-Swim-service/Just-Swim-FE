import { numberFormat } from "@utils";

export function getToday() {
  const date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const utc = date.getTime() + (date.getTimezoneOffset() * 60 * 1000);
  const kstGap = 9 * 60 * 60 * 1000;
  const today = new Date(utc + kstGap);

  return today;
}

export function convertKoreanTime(date: Date) {
  const utc = date.getTime() + (date.getTimezoneOffset() * 60 * 1000);
  const kstGap = 9 * 60 * 60 * 1000;
  const newDate = new Date(utc + kstGap);

  return newDate;
}

export function getThisWeek() {
  const result = [];
  
  const today = getToday();
  const nowDay = today.getDay();

  for (let i = 0; i < 7; i++) {
    const newDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (nowDay - i));

    result.push(`${numberFormat(newDate.getFullYear())}.${numberFormat(newDate.getMonth() + 1)}.${numberFormat(newDate.getDate())}`);
  }

  return result;
}

const calculatePrevMonth = (startDay: Date) => {
  const prevDate = startDay.getDate();
  const prevDay = startDay.getDay();

  const days = [];

  for (let i = prevDate - prevDay; i <= prevDate; i++) {
    days.push(i);
  }
  
  return days;
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

export function getMonth(date = new Date()) {
  const result = [];

  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  const startDay = new Date(currentYear, currentMonth, 0);
  const endDay = new Date(currentYear, currentMonth + 1, 0);
  
  const prevMonthDays = calculatePrevMonth(startDay);
  const thisMonthDays = calculateThisMonth(endDay);
  const nextMonthDays = calculateNextMonth(endDay);

  if (prevMonthDays.length !== 7) {
    for (const day of prevMonthDays) {
      const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1);
      
      result.push(`${numberFormat(prevMonth.getFullYear())}.${numberFormat(prevMonth.getMonth() + 1)}.${numberFormat(day)}`);
    }
  }

  for (const day of thisMonthDays) {
    result.push(`${numberFormat(date.getFullYear())}.${numberFormat(date.getMonth() + 1)}.${numberFormat(day)}`);
  }

  for (const day of nextMonthDays) {
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1);
    
    result.push(`${numberFormat(nextMonth.getFullYear())}.${numberFormat(nextMonth.getMonth() + 1)}.${numberFormat(day)}`);
  }

  return result;
}

export function getWeekNumber(targetDate: Date) {
  const date = targetDate;
  const currentDate = date.getDate();
  const startOfMonth = new Date(date.setDate(1));
  
  const weekDay = startOfMonth.getDay();
  
  return Math.floor(((weekDay - 1) + (currentDate)) / 7) + 1;
}