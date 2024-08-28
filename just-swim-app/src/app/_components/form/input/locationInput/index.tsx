"use client";

import { ForwardedRef, InputHTMLAttributes, forwardRef, useEffect, useRef, useState } from 'react';

import { LocationInputPros } from '@types';
import { IconInputValid, IconLocation } from '@assets';
import { mergeRefs } from '@utils';
import { useModal } from '@hooks';
import { LocationModal } from '@components';

import styled from './styles.module.scss';

function _LocationInput({
  name,
  valid = true,
  defalutValue = '',
  errorMessage = '',
  ...props
}: LocationInputPros & InputHTMLAttributes<HTMLInputElement>,
ref: ForwardedRef<HTMLInputElement>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [nowLocation, setNowLocation] = useState<string>(defalutValue);

  const { modal, showModal, unshowModal, hideModal } = useModal();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setAttribute('value', `${nowLocation}`);
      inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, [nowLocation]);

  const selectLocation = (location: string) => {
    setNowLocation(location);
  }

  return (
    <div className={styled.input_wrapper} onClick={showModal}>
      <div className={styled.icon_wrapper}>
        <IconLocation width={20} height={20} />
      </div>
      <input
        {...props}
        name={name}
        className={`${styled.location_input} ${!valid ? styled.invalid : ''}`}
        ref={mergeRefs(inputRef, ref)}
        type='text'
        readOnly
      />
      {
        inputRef.current?.value && valid && 
        <IconInputValid width={18} height={18} />
      }
      {
        errorMessage && 
        <div className={styled.error_message}>
          <p>{errorMessage}</p>
        </div>
      }
      {
        modal &&
        <LocationModal
          location={nowLocation}
          selectLocation={selectLocation}
          hideModal={hideModal}
          unshowModal={unshowModal}
        />
      }
    </div>
  );
}

/**
 * 상위 컴포넌트에서 LocationInput 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} name input의 name
 * @param {boolean} valid input이 유효한지 여부
 * @param {import('react').MutableRefObject<HTMLInputElement>} ref input의 ref attribute에 연결할 target
 * @param {import('react').InputHTMLAttributes<HTMLInputElement>} attributes input에서 사용 가능한 모든 attributes
 */
export const LocationInput = forwardRef(_LocationInput);