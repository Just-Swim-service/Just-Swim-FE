"use client";

import { MouseEvent, useState } from 'react';

import { ModalCalendarItem, LightConfirmModal, MonthPicker } from '@components';
import { useCalendar } from '@hooks';
import { randomId } from '@utils';
import { WEEK_DAYS } from '@data';
import { DateModalProps } from '@types';
import { IconArrowRightSmall } from '@assets';

import styled from './styles.module.scss';

export function DateModal({
  initialDate,
  hideModal,
  setDate
}: DateModalProps) {
  const [selectMonth, setSelectMonth] = useState<boolean>(false);

  const toggleSelectMonth = () => {
    setSelectMonth(s => !s);
  }

  const {
    days,
    currentYear,
    currentMonth,
    selectedDate,
    setYear,
    setMonth,
  } = useCalendar({
    CalendarItem: ModalCalendarItem,
    initialDate,
  });

  const confirmSelectedDate = (event: MouseEvent<HTMLButtonElement>) => {
    setDate(selectedDate);
    hideModal(event);
  }

  const updateMonth = ({ year, month }: { year: number, month: number }) => {
    setYear(year);
    setMonth(month);
  }

  return (
    <LightConfirmModal 
      title={selectMonth ? '' : '피드백 기준일'}
      hideModal={hideModal}
      confirmCallback={confirmSelectedDate}
    >
      <div className={styled.modal}>
        <div className={styled.month_info}>
          <p>{currentMonth + 1}월</p>
          <button onClick={toggleSelectMonth}>
            <IconArrowRightSmall
              style={{
                rotate: `${selectMonth ? '90deg' : '0deg'}`
              }}
            />
          </button>
        </div>
        {
          selectMonth
          ?
            <MonthPicker
              yearValue={currentYear}
              monthValue={currentMonth}
              updateValue={updateMonth}
            />
          :
            <>
              <div className={styled.week_days}>
                {
                  WEEK_DAYS.map((d, idx) => {
                    return (
                      <div 
                        key={randomId()} 
                        className={`${styled.weeek_item} ${idx === 0 && styled.sunday} ${idx === 6 && styled.saturday}`}
                      >
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
            </>
        }        
      </div>
    </LightConfirmModal>
  );
}
