'use client';

import { ForwardedRef, InputHTMLAttributes, MouseEvent, forwardRef, useState } from 'react';

import { TimeModal } from '@components';
import { TimeInputProps } from '@types';

import styled from './styles.module.scss';

function _TimeInput({
  name,
  defaultTimeValue = "10:30",
  ...props
}: TimeInputProps & InputHTMLAttributes<HTMLInputElement>,
ref: ForwardedRef<HTMLInputElement>) {
  // 현재 선택된 시간 관련
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  const changeSelectedTime = (time: string) => {
    setSelectedTime(time);
  }

  // 모달 보여줄지 말지
  const [modal, setModal] = useState<boolean>(false);

  const showModal = () => {
    setModal(true);
  }

  const hideModal = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setModal(false);
  }

  return (
    <div className={styled.input_wrapper}>
      <input
        {...props}
        name={name}
        className={styled.time_input}
        ref={ref}
        type='text'
        readOnly
        value={selectedTime}
        onClick={showModal}
      />
      {
        modal && 
        <TimeModal
          timeValue={selectedTime || defaultTimeValue}
          setTimeValue={changeSelectedTime}
          hideModal={hideModal}
        />
      }
    </div>
  );
}

/**
 * 상위 컴포넌트에서 TimeInput 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} name input의 name
 * @param {string} defaultTimeValue time picker에서 처음에 보여줄 시간
 * @param {import('react').MutableRefObject<HTMLInputElement>} ref input의 ref attribute에 연결할 target
 * @param {import('react').InputHTMLAttributes<HTMLInputElement>} attributes input에서 사용 가능한 모든 attributes
 */
export const TimeInput = forwardRef(_TimeInput);