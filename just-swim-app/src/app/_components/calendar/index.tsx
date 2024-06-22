'use client';

import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useState } from "react";

import { ArrowLeftSVG, ArrowRightSVG, ArrowDownSVG } from "@components";
import { randomId } from "@utils";

import styled from './styles.module.scss';

const date = new Date();
const utc = date.getTime() + (date.getTimezoneOffset() * 60 * 1000);
const kstGap = 9 * 60 * 60 * 1000;
const today = new Date(utc + kstGap);

const days = [
  "월",
  "화",
  "수",
  "목",
  "금",
  "토",
  "일",
];

const RenderPrevMonth = ({ startDay, DateBlock }: { startDay: Date, DateBlock: JSX.ElementType }) => {
  const prevDate = startDay.getDate();
  const prevDay = startDay.getDay();
  const days = [];

  for (let i = prevDate - prevDay; i <= prevDate; i++) {
    days.push(i);
  }

  return (
    <>
      {
        days.map(day => {
          return (
            <div key={randomId()} className={styled.days_wrapper}>
              <div key={randomId()} className={`${styled.days} ${styled.disable_days}`}>
                <DateBlock>{day}</DateBlock>
              </div>
            </div>
           
          )
        })
      }
    </>
  )
}

const RenderThisMonth = ({ 
  todayExists,
  today,
  selectedDay,
  setSelectedDay,
  endDay, 
  DateBlock,
  updateDate
}: { 
  todayExists: boolean
  today: number,
  selectedDay: number,
  setSelectedDay: Dispatch<SetStateAction<number>>,
  endDay: Date, 
  DateBlock: JSX.ElementType,
  updateDate: (date: number) => void
 }) => {
  const nextDate = endDay.getDate();
  const days = [];

  for (let i = 1; i <= nextDate; i++) {
    days.push(i);
  }

  useEffect(() => {
    updateDate(selectedDay);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay]);

  return (
    <>
      {
        days.map(day => {
          return (
            <div key={randomId()} className={styled.days_wrapper}>
              <div className={`${styled.days} ${styled.active_days} ${todayExists && today === day ? styled.today : ''} ${selectedDay === day ? styled.selected : ''}`}>
                <DateBlock onClick={() => {setSelectedDay(day)}}>{day}</DateBlock>
              </div>
            </div>
          )
        })
      }
    </>
  )
}

const RenderNextMonth =  ({ endDay, DateBlock }: { endDay: Date, DateBlock: JSX.ElementType }) => {
  const nextDay = endDay.getDay();
  const days = [];

  for (let i = 1; i <= (7 - (nextDay + 1) == 7 ? 0 : 7 - (nextDay + 1)); i++) {
    days.push(i);
  }

  return (
    <>
      {
        days.map(day => {
          return (
            <div key={randomId()} className={styled.days_wrapper}>
              <div key={randomId()} className={`${styled.days} ${styled.disable_days}`}>
                <DateBlock>{day}</DateBlock>
              </div>
            </div>
          )
        })
      }
    </>
  )
}

const RenderCalendar = ({ 
  targetMonth, 
  today, 
  DateBlock,
  selectedDate,
  changeSelectedDate,
  setCurrentValues,
 }: { 
  targetMonth: Date, 
  today: Date, 
  DateBlock: JSX.ElementType,
  selectedDate: string,
  changeSelectedDate: (date: string) => void,
  setCurrentValues: Dispatch<SetStateAction<{ currentYear: number, currentMonth: number }>>,
}) => {
  const currentYear = targetMonth.getFullYear();
  const currentMonth = targetMonth.getMonth();

  const startDay = new Date(currentYear, currentMonth, 0);
  const endDay = new Date(currentYear, currentMonth + 1, 0);

  const [renderValues, setRenderValues] = useState<{
    existsToday: boolean,
    existsSelected: boolean,
    selectedDay: number,
  }>({
    existsToday: false,
    existsSelected: false,
    selectedDay: -1,
  });

  const [selectedDay, setSelectedDay] = useState<number>(-1);
 
  useLayoutEffect(() => {
    const result = {
      existsToday: today.getFullYear() === currentYear && today.getMonth() === currentMonth,
      existsSelected: false,
      selectedDay: -1,
    }

    if (selectedDate) {
      let [inputYear, inputMonth, inputDate] = selectedDate.split(" ").slice(0, 3).map((el) => parseInt(el.slice(0, -1)));

      if (inputYear === currentYear && inputMonth - 1 === currentMonth) {
        result.existsSelected = true;
        result.selectedDay = inputDate;
      } else {
        result.existsSelected = false;
        result.selectedDay = inputDate;
      }
    }

    setRenderValues({ ...result });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetMonth]);

  useLayoutEffect(() => {
    setSelectedDay(renderValues.existsSelected ? renderValues.selectedDay : renderValues.selectedDay === -1 && renderValues.existsToday ? today.getDate() : -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderValues]);

  const onClickNext = () => {
    setCurrentValues({
      currentYear: currentYear, 
      currentMonth: currentMonth + 1 
    });
  }

  const onClickPrev = () => {
    setCurrentValues({
      currentYear: currentYear, 
      currentMonth: currentMonth - 1 
    });
  }

  const updateDate = (date: number) => {
    const result = `${currentYear}년 ${currentMonth + 1}월 ${date}일`;

    changeSelectedDate(result);
  }

  return (
    <div className={styled.calendar}>
      <div className={styled.title}>
        <div className={styled.title_wrapper}>
          <p>{currentYear + '년 ' + (currentMonth + 1) + "월"}</p>
        </div>
        <div className={styled.button_wrapper}>
          <button onClick={onClickPrev}>
            <ArrowLeftSVG width={20} height={20} />
          </button>
          <button onClick={onClickNext}>
            <ArrowRightSVG width={20} height={20} />
          </button>
        </div>
      </div>
      <div className={styled.sub_title}>
        {
          days.map((day, index) => {
            return (
              <div key={randomId()} className={`${styled.sub_title_wrapper} ${index === 0 ? styled.sunday : ''} ${index === 6 ? styled.saturday : ''}`}>
                <span>{day}</span>
              </div>
            )
          })
        }
      </div>
      <div className={styled.body}>
        <RenderPrevMonth
          startDay={startDay}
          DateBlock={DateBlock}
        />
        <RenderThisMonth
          todayExists={renderValues.existsToday}
          today={today.getDate()}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          endDay={endDay}
          DateBlock={DateBlock}
          updateDate={updateDate}
        />
        <RenderNextMonth
          endDay={endDay}
          DateBlock={DateBlock}
        />
      </div>
    </div>
  )
}

const defaultDateBlock = () => {
  return <div></div>
}

export function Calendar({
  DateBlock = defaultDateBlock,
  selectedDate = '',
  changeSelectedDate = () => {},
}: {
  DateBlock?: JSX.ElementType,
  selectedDate?: string,
  changeSelectedDate?: (date: string) => void
}) {
  const [thisMonth, setThisMonth] = useState<Date>(new Date());
  const [currentValues, setCurrentValues] = useState<{
    currentYear: number,
    currentMonth: number
  }>({
    currentYear: today.getFullYear(),
    currentMonth: today.getMonth(),
  });
  const [showMonthModal, setShowMonthModal] = useState<boolean>(false);

  useEffect(() => {
    if (selectedDate) {
      let [inputYear, inputMonth] = selectedDate.split(" ").slice(0, 2).map((el) => parseInt(el.slice(0, -1)));

      setCurrentValues({
        currentYear: inputYear,
        currentMonth: inputMonth - 1
      })
    }
  }, [selectedDate]);


  useEffect(() => {
    setThisMonth(new Date(currentValues.currentYear, currentValues.currentMonth, 1));
  }, [currentValues]);

  return (
    <div className={styled.calendar_wrapper}>
      <RenderCalendar
        targetMonth={thisMonth}
        today={today}
        DateBlock={DateBlock}
        selectedDate={selectedDate}
        changeSelectedDate={changeSelectedDate}
        setCurrentValues={setCurrentValues}
      />
    </div>
  )
}