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
  };

  const confirmSelectedTime = (event: MouseEvent<HTMLButtonElement>) => {
    setTimeValue(selectedTime);
    hideModal(event);
  };

  const preventTouch = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <ConfirmModal hideModal={hideModal} confirmCallback={confirmSelectedTime}>
      <div
        className={styled.modal}
        onTouchStart={preventTouch}
        onTouchMove={preventTouch}
        onTouchEnd={preventTouch}>
        <TimePicker value={selectedTime} updateValue={changeSelectedTime} />
      </div>
    </ConfirmModal>
  );
}
