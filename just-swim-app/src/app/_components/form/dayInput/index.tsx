'use client';

import { ForwardedRef, InputHTMLAttributes, MouseEvent, forwardRef, useState } from 'react';

import { DayModal, CalendarSmallSVG } from '@components';
import { DayInputProps } from '@types';

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

function _DayInput({
  name,
  ...props
}: DayInputProps & InputHTMLAttributes<HTMLInputElement>,
ref: ForwardedRef<HTMLInputElement>) {
  // 현재 선택된 색 관련
  const [days, setDays] = useState<DayProps>({
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

  const makeInputValue =  () => {
    let result = '';

    for (const day of Object.keys(days)) {
      if (days[day]) {
        result += `${dayEngToKor[day]}, `;
      }
    }

    result = result.slice(0, -2);

    if (result) {
      result += '요일';
    }

    return result;
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
      <div className={styled.icon_wrapper} onClick={showModal}>
        <CalendarSmallSVG width={14} height={14} />
      </div>
      <input
        {...props}
        name={name}
        className={styled.day_input}
        ref={ref}
        type='text'
        readOnly
        value={makeInputValue()}
        onClick={showModal}
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
 * @param {import('react').MutableRefObject<HTMLInputElement>} ref input의 ref attribute에 연결할 target
 * @param {import('react').InputHTMLAttributes<HTMLInputElement>} attributes input에서 사용 가능한 모든 attributes
 */
export const DayInput = forwardRef(_DayInput);