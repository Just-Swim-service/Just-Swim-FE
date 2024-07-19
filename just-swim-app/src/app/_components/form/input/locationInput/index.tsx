"use client";

import { ForwardedRef, InputHTMLAttributes, forwardRef, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { LocationInputPros } from '@types';
import { IconInputValid, IconLocation } from '@assets';
import { mergeRefs } from '@utils';

import styled from './styles.module.scss';
import { locationStore } from '@store';

function _LocationInput({
  name,
  valid = true,
  defalutValue = '',
  ...props
}: LocationInputPros & InputHTMLAttributes<HTMLInputElement>,
ref: ForwardedRef<HTMLInputElement>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [nowLocation, setNowLocation] = useState<string>(defalutValue);

  const { location, setLocation } = locationStore();

  useEffect(() => {
    if (location) {
      setNowLocation(location);
    }

    return () => {
      if (history.state.__PRIVATE_NEXTJS_INTERNALS_TREE[1].children[1].children[0] === 'search' && history.state.__PRIVATE_NEXTJS_INTERNALS_TREE[1].children[1].children[1].children[0] === 'location') {
        setLocation(nowLocation);

        return;
      }

      setLocation("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowLocation]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setAttribute('value', nowLocation);
      inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, [nowLocation]);

  return (
    <div className={styled.input_wrapper}>
      <Link
        href='/search/location'
        className={styled.icon_wrapper}
      >
        <IconLocation width={20} height={20} />
      </Link>
      <input
        {...props}
        name={name}
        className={`${styled.location_input} ${!valid ? styled.invalid : ''}`}
        ref={mergeRefs(inputRef, ref)}
        type='text'
        readOnly
        value={nowLocation}
      />
      {valid && <IconInputValid width={18} height={18} />}
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