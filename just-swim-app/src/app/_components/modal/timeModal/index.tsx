'use client';

import { MouseEvent, useState } from 'react';

import { ConfirmButton, TimePicker } from '@components';

import styled from './styles.module.scss';

export function TimeModal({
  timeValue,
  setTimeValue,
  hideModal,
}: {
  timeValue: string,
  hideModal: (event: MouseEvent<HTMLButtonElement>) => void,
  setTimeValue: (time: string) => void,
}) {
  const [selectedTime, setSelectedTime] = useState<string>(timeValue);
  
  const changeSelectedTime = (time: string) => {
    setSelectedTime(time);
  }

  const confirmSelectedTime = (event: MouseEvent<HTMLButtonElement>) => {
    setTimeValue(selectedTime);
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
        <TimePicker
          value={selectedTime}
          setValue={changeSelectedTime}
        />
        <div className={styled.modal_btn}>
          <ConfirmButton text='취소' kind='normal' onClick={hideModal} />
          <ConfirmButton text='변경' kind='confirm' onClick={confirmSelectedTime} />
        </div>
      </div>
    </div>
  );
}