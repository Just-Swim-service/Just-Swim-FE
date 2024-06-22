"use client";

import { MouseEvent, useState } from 'react';

import { DatePicker, ConfirmButton } from '@components';

import styled from './styles.module.scss';

export function DateModal({
  initialDate,
  hideModal,
  setDate
}: {
  initialDate: string,
  hideModal: (event: MouseEvent<HTMLButtonElement>) => void,
  setDate: (color: string) => void,
}) {
  // date 선택 관련
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);

  const changeSelectedDate = (date: string) => {
    setSelectedDate(date);
  }

  const confirmSelectedDate = (event: MouseEvent<HTMLButtonElement>) => {
    setDate(selectedDate);
    hideModal(event);
  }

  const preventDefault = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  }

  return (
    <div className={styled.modal_wrapper} onClick={preventDefault}>
      <div className={styled.modal}>
        <button
          className={styled.modal_top_btn}
          onClick={hideModal}>
          <div />
        </button>
        <DatePicker
          selectedDate={initialDate}
          changeSelectedDate={changeSelectedDate}
        />
        <div className={styled.modal_btn}>
          <ConfirmButton text='취소' kind='confirm-sub' onClick={hideModal} />
          <ConfirmButton text='변경' kind='confirm' onClick={confirmSelectedDate} />
        </div>
      </div>
    </div>
  );
}
