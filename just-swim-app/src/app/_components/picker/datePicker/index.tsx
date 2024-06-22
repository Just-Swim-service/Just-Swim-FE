'use client';

import { Calendar } from '@components';

import styled from './styles.module.scss';
import { HTMLAttributes } from 'react';

export function DatePicker({
  selectedDate,
  changeSelectedDate
}: {
  selectedDate: string,
  changeSelectedDate: (date: string) => void,
}) {
  const DateBlock = ({
    children,
    ...props
  }: {
    children: React.ReactNode
  } & HTMLAttributes<HTMLButtonElement>) => {
    return (
      <button 
        style={{
          padding: 20
        }}
        {...props}
      >
        {children}
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