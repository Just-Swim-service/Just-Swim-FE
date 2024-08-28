'use client';

import { Dispatch, MouseEvent, SetStateAction, TouchEvent, useEffect, useRef, useState } from "react";

import { LectureProps } from "@types";
import { ClassDetailItem, Portal } from "@components";
import { randomId, throttle } from "@utils";
import { WEEK_DAYS } from "@data";

import styled from './styles.module.scss';

export function ClassList({
  selectedDate,
  monthlyInfo,
  itemHeight,
  unshowClass,
}: {
  selectedDate: string,
  monthlyInfo: { date: string, day: string, lectures: LectureProps[] }[],
  itemHeight: number,
  unshowClass: () => void,
}) {
  const date = new Date(selectedDate);

  const [movingCursorPositon, setMovingCursorPosition] = useState<number>(0);
  const startCursorPosition = useRef<number>(0);
  const startDrag = useRef<boolean>(false);

  const todayInfo = monthlyInfo.find(info => info.date === selectedDate);
  const scheduleInfo = todayInfo?.lectures || [];  

  const handleDragStart = (event: MouseEvent<HTMLButtonElement>) => {
    startDrag.current = true;
    startCursorPosition.current = event.pageY;
  };

  const handleDragMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (!startDrag.current) {
      return;
    }

    if (event.pageY - startCursorPosition.current <= 0) {
      return;
    }

    setMovingCursorPosition(event.pageY - startCursorPosition.current);
  };
  
  const handleDragEnd = () => {
    if (!startDrag.current) {
      return;
    }

    if (movingCursorPositon > 100) {
      unshowClass();
    }

    setMovingCursorPosition(0);
    startDrag.current = false;
  };

  const handleTouchStart = (event: TouchEvent<HTMLButtonElement>) => {
    startCursorPosition.current = event.targetTouches[0].pageY;
  };

  const handleTouchMove = (event: TouchEvent<HTMLButtonElement>) => {
    if (event.targetTouches[0].pageY - startCursorPosition.current <= 0) {
      return;
    }

    setMovingCursorPosition(event.targetTouches[0].pageY - startCursorPosition.current);
  };
  
  const handleTouchEnd = () => {
    if (movingCursorPositon > 100) {
      unshowClass();
    }

    setMovingCursorPosition(0);
  };

  return (
    <Portal>
      <div
        className={styled.container}
        style={{
          height: window.innerHeight - (266 + itemHeight + itemHeight),
          transform: `translateY(${movingCursorPositon}px)`
        }}
      >
        <button
          className={styled.top_btn}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={throttle(handleTouchMove, 10)}
          onTouchEnd={handleTouchEnd}
        >
          <div />
        </button>
        <div className={styled.info}>
          <span>{date.getDate()},</span>
          <span className={`${styled.date} ${date.getDay() === 6 && styled.blue} ${date.getDay() === 0 && styled.red}`}>{WEEK_DAYS[date.getDay()]}</span>
        </div>
        <div className={styled.list}>
          {
            scheduleInfo.length !== 0 ?
            scheduleInfo.map(schedule => {
              return (
                <ClassDetailItem
                  key={randomId()}
                  schedule={schedule}
                />
              )
            }): 
            <div>
              <p>등록된 수업이 없습니다.</p>
            </div>
          }
        </div>
      </div>
    </Portal>
  )
}