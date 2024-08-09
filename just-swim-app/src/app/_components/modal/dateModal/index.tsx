"use client";

import { MouseEvent } from 'react';

import { ModalCalendarItem, LightConfirmModal } from '@components';
import { useCalendar } from '@hooks';
import { randomId } from '@utils';
import { weekDays } from '@data';
import { DateModalProps } from '@types';

import styled from './styles.module.scss';

export function DateModal({
  initialDate,
  hideModal,
  setDate
}: DateModalProps) {
  const {
    days,
    currentYear,
    currentMonth,
    selectedDate,
  } = useCalendar({
    CalendarItem: ModalCalendarItem,
    initialDate,
  });

  const confirmSelectedDate = (event: MouseEvent<HTMLButtonElement>) => {
    setDate(selectedDate);
    hideModal(event);
  }

  return (
    <LightConfirmModal 
      title='피드백 기준일'
      hideModal={hideModal}
      confirmCallback={confirmSelectedDate}
    >
      <div className={styled.modal}>
        <div className={styled.month_info}>
          <p>{currentMonth + 1}월</p>
        </div>
        <div className={styled.week_days}>
          {
            weekDays.map((d, idx) => {
              return (
                <div key={randomId()} className={`${styled.weeek_item} ${idx === 0 && styled.sunday} ${idx === 6 && styled.saturday}`}>
                  <span>{d}</span>
                </div>
              )
            })
          }
        </div>
        <div className={styled.calendar}>
          {
            days.map(d => {
              return (
                <div key={randomId()} className={styled.calendar_item}>
                  {d}
                </div>
              )
            })
          }
        </div>
      </div>
    </LightConfirmModal>
  );
}
