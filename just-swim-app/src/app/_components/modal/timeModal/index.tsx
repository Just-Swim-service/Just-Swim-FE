'use client';

import { MouseEvent, useState } from 'react';

import { TimePicker, ConfirmModal } from '@components';
import { TimeModalProps } from '@types';

import styled from './styles.module.scss';

export function TimeModal({
  timeValue,
  setTimeValue,
  hideModal,
}: TimeModalProps) {
  const [selectedTime, setSelectedTime] = useState<string>(timeValue);

  const changeSelectedTime = (time: string) => {
    setSelectedTime(time);
  }

  const confirmSelectedTime = (event: MouseEvent<HTMLButtonElement>) => {
    setTimeValue(selectedTime);
    hideModal(event);
  }

  return (
    <ConfirmModal 
      hideModal={hideModal}
      confirmCallback={confirmSelectedTime}
    >
      <div className={styled.modal}>
        <TimePicker
          value={selectedTime}
          updateValue={changeSelectedTime}
        />
      </div>
    </ConfirmModal>
  );
}