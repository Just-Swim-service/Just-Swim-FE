'use client';

import { ChangeEvent, FocusEvent, ForwardedRef, InputHTMLAttributes, MouseEvent, forwardRef, useState } from 'react';
import Link from 'next/link';

import { LinkInputProps } from '@types';
import { IconTrash } from '@assets';

import styled from './styles.module.scss';

function _LinkInput({
  name,
  errors=[],
  onChange = (event: ChangeEvent<HTMLInputElement>) => {},
  ...props
}: LinkInputProps & InputHTMLAttributes<HTMLInputElement> & {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
},
ref: ForwardedRef<HTMLInputElement>) {
  const [link, setLink] = useState<string>('');
  const [focus, setFocus] = useState<boolean>(false);

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setLink(event.target.value);
  }

  const onFocusInput = (event: FocusEvent<HTMLInputElement>) => {
    setFocus(true);
  }

  const onBlurInput = (event: FocusEvent<HTMLInputElement>) => {
    setFocus(false);
  }

  const onClickButton = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setLink('');
  }

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeInput(event);
    onChange(event);
  }
  
  return (
    <div className={styled.input_wrapper}>
      <input
        {...props}
        name={name}
        className={styled.link_input}
        ref={ref}
        type='text'
        value={link}
        onChange={handleOnChange}
        onFocus={onFocusInput}
        onBlur={onBlurInput}
      />
      {/* <span>{errors.map((error, index) => <li key={index}>{ error}</li>)}</span> */}
      {
        !focus && 
        <Link href={link} target='_blank' className={styled.link}>{link}</Link>
      }
      {
        link && 
        <button 
          className={styled.delete_button}
          onClick={onClickButton}
        >
          <IconTrash width={20} height={20} />
        </button>
      }
    </div>
  );
}

/**
 * 상위 컴포넌트에서 LinkInput 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} name input의 name
 * @param {import('react').MutableRefObject<HTMLInputElement>} ref input의 ref attribute에 연결할 target
 * @param {import('react').InputHTMLAttributes<HTMLInputElement>} attributes input에서 사용 가능한 모든 attributes
 */
export const LinkInput = forwardRef(_LinkInput);