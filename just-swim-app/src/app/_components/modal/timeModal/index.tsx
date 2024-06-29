'use client';

import { MouseEvent, useState } from 'react';

import { TimePicker, ConfirmModal } from '@components';

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

  return (
    <ConfirmModal 
      hideModal={hideModal}
      confirmCallback={confirmSelectedTime}
    >
      <div className={styled.modal}>
        <TimePicker
          value={selectedTime}
          setValue={changeSelectedTime}
        />
      </div>
    </ConfirmModal>
  );
}