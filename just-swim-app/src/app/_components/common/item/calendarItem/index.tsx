'use client';

import { HTMLAttributes } from "react";

import styled from './styles.module.scss';

export function CalendarItem ({
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
} & HTMLAttributes<HTMLButtonElement>) {
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