"use client";

import { ForwardedRef, InputHTMLAttributes, forwardRef, useState } from 'react';
import Link from 'next/link';

import { LocationInputPros } from '@types';
import { IconInputValid, IconLocation } from '@assets';

import styled from './styles.module.scss';

function _LocationInput({
  name,
  valid = true,
  ...props
}: LocationInputPros & InputHTMLAttributes<HTMLInputElement>,
ref: ForwardedRef<HTMLInputElement>) {
  const [location, setLocation] = useState<string>("");

  return (
    <div className={styled.input_wrapper}>
      <div className={styled.icon_wrapper}>
        <IconLocation width={20} height={20} />
      </div>
      <input
        {...props}
        name={name}
        className={`${styled.location_input} ${!valid ? styled.invalid : ''}`}
        ref={ref}
        type='text'
        readOnly
        value={location}
      />
      {valid && <IconInputValid width={18} height={18} />}
    </div>
  );
}

/**
 * 상위 컴포넌트에서 TextInput 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} name input의 name
 * @param {boolean} valid input이 유효한지 여부
 * @param {import('react').MutableRefObject<HTMLInputElement>} ref input의 ref attribute에 연결할 target
 * @param {import('react').InputHTMLAttributes<HTMLInputElement>} attributes input에서 사용 가능한 모든 attributes
 */
export const LocationInput = forwardRef(_LocationInput);