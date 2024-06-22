"use client";

import { ForwardedRef, InputHTMLAttributes, MouseEvent, forwardRef, useState } from "react";

import { DateInputProps } from "@types";
import { DateModal } from '@components';

import styled from './styles.module.scss';

function _DateInput({
  name,
  suffix = '',
  renderIcon = () => {},
  ...props
}: DateInputProps & InputHTMLAttributes<HTMLInputElement>,
ref: ForwardedRef<HTMLInputElement>) {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const changeSelectedDate = (date: string) => {
    setSelectedDate(date);
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
      <div className={styled.icon_wrapper}>
        {renderIcon()}
      </div>
      <input
        {...props}
        name={name}
        className={styled.date_input}
        ref={ref}
        type='text'
        readOnly
        value={selectedDate + (selectedDate && ` ${suffix}`)}
        onClick={showModal}
      />
    {
      modal && 
      <DateModal
        initialDate={selectedDate}
        hideModal={hideModal}
        setDate={changeSelectedDate}
      />
    }
  </div>
  )
}

/**
 * 상위 컴포넌트에서 DateInput 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} name input의 name
 * @param {import('react').MutableRefObject<HTMLInputElement>} ref input의 ref attribute에 연결할 target
 * @param {import('react').InputHTMLAttributes<HTMLInputElement>} attributes input에서 사용 가능한 모든 attributes
 */
export const DateInput = forwardRef(_DateInput);