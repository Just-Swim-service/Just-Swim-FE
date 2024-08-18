'use client';

import { HTMLAttributes } from "react";

import { CalendarItemProps } from "@types";

import styled from './styles.module.scss';

export function ModalCalendarItem ({
  date,
  isDisabled,
  isToday,
  isSelected,
  ...props
}: CalendarItemProps & HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${styled.days} ${isDisabled ? styled.disabled : ''} ${isToday ? styled.today : ''} ${isSelected ? styled.selected : ''}`}
      {...props}
    >
      {date}
    </button>
  )
}