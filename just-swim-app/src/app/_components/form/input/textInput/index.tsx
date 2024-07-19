'use client';

import { ChangeEvent, ForwardedRef, InputHTMLAttributes, forwardRef, useEffect, useRef, useState } from 'react';

import { TextInputProps } from '@types';
import { IconInputValid } from '@assets';
import { mergeRefs } from '@utils';

import styled from './styles.module.scss';

function _TextInput({
  name,
  valid = true,
  maxLength = 0,
  onChange = () => {},
  ...props
}: TextInputProps & InputHTMLAttributes<HTMLInputElement>,
ref: ForwardedRef<HTMLInputElement>) {
  const targetRef = useRef<HTMLInputElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(targetRef.current?.value.length || 0);
  }, []);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setCount(event.target.value.length);
    onChange(event);
  };
  
  return (
    <div className={styled.input_wrapper}>
      <input
        {...props}
        name={name}
        className={`${styled.text_input} ${!valid ? styled.invalid : ''}`}
        ref={mergeRefs(targetRef, ref)}
        type='text'
        onChange={onChangeHandler}
      />
      {valid && <IconInputValid width={18} height={18} />}
      <div className={styled.text_length}>
        <span className={`${count <= maxLength ? styled.count_valid : styled.count_invalid}`}>{count}</span>
        <span>/</span>
        <span>{maxLength}</span>
      </div>
    </div>
  );
}

/**
 * 상위 컴포넌트에서 TextInput 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} name input의 name
 * @param {boolean} valid input이 유효한지 여부
 * @param {number} maxLength input의 최대 길이 (출력 용도, 유효성에는 영향 x)
 * @param {import('react').MutableRefObject<HTMLInputElement>} ref input의 ref attribute에 연결할 target
 * @param {import('react').InputHTMLAttributes<HTMLInputElement>} attributes input에서 사용 가능한 모든 attributes
 */
export const TextInput = forwardRef(_TextInput);