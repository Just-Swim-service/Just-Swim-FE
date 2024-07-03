"use client";

import { MouseEvent, useState } from 'react';

import { DatePicker, ConfirmModal } from '@components';
import { DateModalProps } from '@types';

import styled from './styles.module.scss';

export function DateModal({
  initialDate,
  hideModal,
  setDate
}: DateModalProps) {
  // date 선택 관련
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);

  const changeSelectedDate = (date: string) => {
    setSelectedDate(date);
  }

  const confirmSelectedDate = (event: MouseEvent<HTMLButtonElement>) => {
    setDate(selectedDate);
    hideModal(event);
  }

  return (
    <ConfirmModal 
      hideModal={hideModal} 
      confirmCallback={confirmSelectedDate}
    >
      <div className={styled.modal}>
        <DatePicker
          selectedDate={initialDate}
          changeSelectedDate={changeSelectedDate}
        />
      </div>
    </ConfirmModal>
  );
}
