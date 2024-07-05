'use client';

import { ForwardedRef, InputHTMLAttributes, forwardRef, useEffect, useRef, useState } from 'react';

import { DayModal } from '@components';
import { DayInputProps } from '@types';
import { useModal } from '@hooks';
import { IconInputValid, IconCalendar } from '@assets';
import { mergeRefs } from '@utils';

import styled from './styles.module.scss';

interface DayProps {
  "monday": boolean,
  "tuesday": boolean,
  "wednesday": boolean,
  "thursday": boolean,
  "friday": boolean,
  "saturday": boolean,
  "sunday": boolean,
  [props: string]: any,
}

const dayEngToKor: {[props: string]: any} = {
  "monday": "월",
  "tuesday": "화",
  "wednesday": "수",
  "thursday": "목",
  "friday": "금",
  "saturday": "토",
  "sunday": "일",
}

const dayKorToEng: {[props: string]: any} = {
  "월": "monday",
  "화": "tuesday",
  "수": "wednesday",
  "목": "thursday",
  "금":  "friday",
  "토": "saturday",
  "일": "sunday",
}

const makeInitialValue = (defaultValue: string): DayProps => {
  const result = {
    "monday": false,
    "tuesday": false,
    "wednesday": false,
    "thursday": false,
    "friday": false,
    "saturday": false,
    "sunday": false,
  }

  if (defaultValue) {
    defaultValue.split('').forEach(day => {
      // @ts-ignore
      result[dayKorToEng[day]] = true;
    });
  }

  return result;
}

const makeInputValue = (days: DayProps) => {
  let result = '';

  for (const day of Object.keys(days)) {
    if (days[day]) {
      result += dayEngToKor[day];
    }
  }

  return result;
}

const makePrintValue = (days: DayProps) => {
  let result = '';

  for (const day of Object.keys(days)) {
    if (days[day]) {
      result += `${dayEngToKor[day]}, `;
    }
  }

  result = result.slice(0, -2);
  result += '요일';

  return result;
}

const checkDefaultValue = (defaultValue: string) => {
  const regexp = /[월화수목금토일]{1,7}$/g;

  return regexp.test(defaultValue);
}

function _DayInput({
  name,
  valid = true,
  defaultValue = '',
  placeholder = '',
  ...props
}: DayInputProps & InputHTMLAttributes<HTMLInputElement>,
ref: ForwardedRef<HTMLInputElement>) {
  const inputRef = useRef<HTMLInputElement>(null);

  // 현재 선택된 색 관련
  const [days, setDays] = useState<DayProps>(
    checkDefaultValue(defaultValue) 
    ? makeInitialValue(defaultValue) 
    : {
    "monday": false,
    "tuesday": false,
    "wednesday": false,
    "thursday": false,
    "friday": false,
    "saturday": false,
    "sunday": false,
  });

  const changeSelectedDay = (days: DayProps) => {
    setDays({
      ...days
    });
  };
  
  const { modal, showModal, hideModal } = useModal();

  const inputValue = makeInputValue(days);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setAttribute('value', makeInputValue(days));
      inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, [days]);
  
  return (
    <div className={styled.input_wrapper}>
      <div className={styled.icon_wrapper} onClick={showModal}>
        <IconCalendar width={14} height={14} />
      </div>
      <div className={`${styled.day_input} ${inputValue ? '' : styled.empty}`} onClick={showModal}>
        <span>{inputValue ? makePrintValue(days) : placeholder}</span>
      </div>
      {
        valid && 
        <div className={styled.valid_warpper}>
          <IconInputValid width={18} height={18} />
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
      {
        modal && 
        <DayModal
          initialDays={days}
          hideModal={hideModal}
          setDays={changeSelectedDay}
        />
      }
    </div>
  );
}

/**
 * 상위 컴포넌트에서 DayInput 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} name input의 name
 * @param {boolean} valid input이 유효한지 여부
 * @param {string} defaultValue input의 초기 값, '월화수'의 형태
 * @param {import('react').MutableRefObject<HTMLInputElement>} ref input의 ref attribute에 연결할 target
 * @param {import('react').InputHTMLAttributes<HTMLInputElement>} attributes input에서 사용 가능한 모든 attributes
 */
export const DayInput = forwardRef(_DayInput);