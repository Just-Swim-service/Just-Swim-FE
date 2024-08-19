'use client';

import { ForwardedRef, InputHTMLAttributes, forwardRef, useEffect, useRef, useState } from 'react';

import { TimeModal } from '@components';
import { TimeInputProps } from '@types';
import { mergeRefs, numberFormat } from '@utils';
import { useModal } from '@hooks';
import { IconInputValid, IconClock } from '@assets';

import styled from './styles.module.scss';

const checkValue = (defalutValue: string) => {
  const regexp = /\d{2}:\d{2}~\d{2}:\d{2}$/g;

  return regexp.test(defalutValue);
}

const TimeBlock = ({
  selectedTime,
  changeSelectedTime,
  defaultTimeValue = "10:30",
  placeholder = '',
  valid
}: {
  selectedTime: string,
  changeSelectedTime: (time: string) => void,
  defaultTimeValue?: string,
  placeholder?: string,
  valid: boolean
}) => {
  const { modal, showModal, hideModal } = useModal();
  
  const hourValue = parseInt(selectedTime.split(":")[0]);
  const minuteValue = selectedTime.split(":")[1];

  return (
    <div className={styled.input_wrapper}>
      <div
        className={`${styled.time_input} ${selectedTime ? '' : styled.empty} ${!valid && styled.invalid}`}
        onClick={showModal}
      >
        <span className={styled.meridiem}>{selectedTime ? hourValue >= 12 ? "PM" : "AM" : ''}</span>
        <span>{selectedTime ? `${numberFormat(hourValue % 12)}:${minuteValue}` : placeholder}</span>
      </div>
      {
        modal && 
        <TimeModal
          timeValue={selectedTime || defaultTimeValue}
          setTimeValue={changeSelectedTime}
          hideModal={hideModal}
        />
      }
    </div>
  )
}

function _TimeInput({
  name,
  valid = true,
  defaultValue = "",
  defaultTimeValue = "10:30",
  errorMessage = '',
  ...props
}: TimeInputProps & InputHTMLAttributes<HTMLInputElement>,
ref: ForwardedRef<HTMLInputElement>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const flag = checkValue(defaultValue);

  const [startTime, setStartTime] = useState<string>(flag ? defaultValue.slice(0, 5) : '');
  const [endTime, setEndTime] = useState<string>(flag ? defaultValue.slice(6) : '');
  
  const changeStartTime = (time: string) => {
    setStartTime(time);
  }

  const changeEndTime = (time: string) => {
    setEndTime(time);
  }

  useEffect(() => {
    if (!startTime && !endTime) {
      return;
    }

    if (inputRef.current) {
      inputRef.current.setAttribute('value', `${startTime}~${endTime}`);
      inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, [startTime, endTime]);

  return (
    <div className={styled.wrapper}>
      <TimeBlock
        selectedTime={startTime}
        changeSelectedTime={changeStartTime}
        defaultTimeValue={defaultTimeValue}
        placeholder='시작 시간'
        valid={valid}
      />
      <div className={styled.divider}>
        <span>~</span>
      </div>
      <TimeBlock
        selectedTime={endTime}
        changeSelectedTime={changeEndTime}
        defaultTimeValue={defaultTimeValue}
        placeholder='종료 시간'
        valid={valid}
      />
      <div className={styled.icon_wrapper}>
        <IconClock width={20} height={20} />
      </div>
      {
        valid && 
        <div className={`${styled.valid_warpper} ${startTime && endTime ? '' : styled.empty}`}>
          <IconInputValid width={18} height={18} />
        </div>
      }
      {
        checkValue(inputRef.current?.value || '') && errorMessage && 
        <div className={styled.error_message}>
          <p>{errorMessage}</p>
        </div>
      }
      {
        errorMessage && 
        <div className={styled.error_message}>
          <p>{errorMessage}</p>
        </div>
      }
      <input
        {...props}
        name={name}
        ref={mergeRefs(inputRef, ref)}
        type='text'
        readOnly
        hidden
      />
    </div>
  );
}

/**
 * 상위 컴포넌트에서 TimeInput 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} name input의 name
 * @param {boolean} valid input이 유효한지 여부
 * @param {string} defaultValue input의 초기 시간 값, 'xx:xx~xx:xx' 형태
 * @param {string} defaultTimeValue time picker에서 처음에 보여줄 시간
 * @param {import('react').MutableRefObject<HTMLInputElement>} ref input의 ref attribute에 연결할 target
 * @param {import('react').InputHTMLAttributes<HTMLInputElement>} attributes input에서 사용 가능한 모든 attributes
 */
export const TimeInput = forwardRef(_TimeInput);