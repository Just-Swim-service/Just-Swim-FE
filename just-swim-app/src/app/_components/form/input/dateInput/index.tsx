"use client";

import { ForwardedRef, InputHTMLAttributes, forwardRef, useEffect, useRef, useState } from "react";

import { DateInputProps } from "@types";
import { DateModal } from '@components';
import { useModal } from "@hooks";
import { IconInputValid } from "@assets";
import { mergeRefs, numberFormat } from "@utils";

import styled from './styles.module.scss';

const formatDate = (date: string, suffix: string) => {
  const [year, month, day] = date.split(".");

  return `${year}년 ${month}월 ${day}일 ${suffix}`;
}

const checkDefaultValue = (defaultValue: string) => {
  const regexp = /\d{4}\.\d{2}\.\d{2}$/g;

  return regexp.test(defaultValue);
}

function _DateInput({
  name,
  valid = true,
  defaultValue = '',
  suffix = '',
  use = true,
  renderIcon = () => {},
  placeholder = '',
  ...props
}: DateInputProps & InputHTMLAttributes<HTMLInputElement>,
ref: ForwardedRef<HTMLInputElement>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const today = new Date();
  const todayValue = defaultValue || `${today.getFullYear()}.${numberFormat(today.getMonth() + 1)}.${numberFormat(today.getDate())}`;

  const [selectedDate, setSelectedDate] = useState<string>(use && checkDefaultValue(todayValue) ? todayValue : '');

  const changeSelectedDate = (date: string) => {
    setSelectedDate(date);
  }
  
  const { modal, showModal, hideModal } = useModal();

  const onClickInput = () => {
    if (use) {
      showModal();
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setAttribute('value', selectedDate);
      inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, [selectedDate]);
  
  return (
    <div className={styled.input_wrapper}>
      <div className={styled.icon_wrapper}>
        {renderIcon()}
      </div>
      <div className={`${styled.date_input} ${selectedDate ? '' : styled.empty}`} onClick={onClickInput}>
        <span>{selectedDate ? formatDate(selectedDate, suffix) : placeholder}</span>
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
 * @param {boolean} valid input이 유효한지 여부
 * @param {string} defaultValue input의 초기 값, 'xxxx.xx.xx'의 형태
 * @param {import('react').MutableRefObject<HTMLInputElement>} ref input의 ref attribute에 연결할 target
 * @param {import('react').InputHTMLAttributes<HTMLInputElement>} attributes input에서 사용 가능한 모든 attributes
 */
export const DateInput = forwardRef(_DateInput);