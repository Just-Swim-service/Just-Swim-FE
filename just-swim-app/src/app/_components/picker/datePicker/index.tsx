'use client';

import { HTMLAttributes } from 'react';

import { Calendar } from '@components';

import styled from './styles.module.scss';

export function DatePicker({
  selectedDate,
  changeSelectedDate
}: {
  selectedDate: string,
  changeSelectedDate: (date: string) => void,
}) {
  const DateBlock = ({
    date,
    isDisabled,
    isToday,
    isSelected,
    clickCallback = () => {},
    ...props
  }: {
    date: number,
    isDisabled: boolean,
    isToday: boolean,
    isSelected: boolean,
    clickCallback?: Function,
  } & HTMLAttributes<HTMLButtonElement>) => {
    const onClickButton = () => {
      clickCallback();
    }

    return (
      <button
        className={`${styled.days} ${isDisabled ? styled.disabled : ''} ${isToday ? styled.today : ''} ${isSelected ? styled.selected : ''}`}
        {...props}
        onClick={onClickButton}
      >
        {date}
      </button>
    )
  }

  return (
    <div className={styled.date_picker}>
      <Calendar
        DateBlock={DateBlock}
        selectedDate={selectedDate}
        changeSelectedDate={changeSelectedDate}
      />
    </div>
  )
}