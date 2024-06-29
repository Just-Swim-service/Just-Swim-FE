import { ForwardedRef, InputHTMLAttributes, forwardRef } from 'react';

import { TextInputProps } from '@types';
import { IconInputValid } from '@assets';

import styled from './styles.module.scss';

function _TextInput({
  name,
  valid = true,
  ...props
}: TextInputProps & InputHTMLAttributes<HTMLInputElement>,
ref: ForwardedRef<HTMLInputElement>) {
  return (
    <div className={styled.input_wrapper}>
      <input
        {...props}
        name={name}
        className={`${styled.text_input} ${!valid ? styled.invalid : ''}`}
        ref={ref}
        type='text'
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
export const TextInput = forwardRef(_TextInput);