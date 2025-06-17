'use client';

import {
  ChangeEvent,
  FocusEvent,
  ForwardedRef,
  InputHTMLAttributes,
  MouseEvent,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import Link from 'next/link';

import { LinkInputProps } from '@types';
import { IconTrash } from '@assets';

import styled from './styles.module.scss';

function _LinkInput(
  {
    name,
    // @ts-ignore
    errors = [],
    value = '',
    onChange = (event: ChangeEvent<HTMLInputElement>) => {},
    ...props
  }: LinkInputProps &
    InputHTMLAttributes<HTMLInputElement> & {
      onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    },
  ref: ForwardedRef<HTMLInputElement>,
) {
  const [link, setLink] = useState<string>(value as string);
  const [focus, setFocus] = useState<boolean>(false);

  useEffect(() => {
    setLink(value as string);
  }, [value]);

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setLink(event.target.value);
  };

  const onFocusInput = (event: FocusEvent<HTMLInputElement>) => {
    setFocus(true);
  };

  const onBlurInput = (event: FocusEvent<HTMLInputElement>) => {
    setFocus(false);
  };

  const onClickButton = (event: MouseEvent<HTMLButtonElement>) => {
    const syntheticEvent = {
      target: {
        name,
        value: '',
      },
    } as unknown as ChangeEvent<HTMLInputElement>;

    setLink('');
    onChange(syntheticEvent);
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeInput(event);
    onChange(event);
  };

  const isValidURL = (url: string) => {
    try {
      return Boolean(new URL(url));
    } catch (e) {
      return false;
    }
  };

  return (
    <div className={styled.input_wrapper}>
      <input
        {...props}
        name={name}
        className={styled.link_input}
        ref={ref}
        type="text"
        value={link}
        onChange={handleOnChange}
        onFocus={onFocusInput}
        onBlur={onBlurInput}
      />
      {!value || !isValidURL(value as string) || focus ? null : (
        <Link href={value as string} target="_blank" className={styled.link}>
          {value}
        </Link>
      )}
      {value && (
        <button className={styled.delete_button} onClick={onClickButton}>
          <IconTrash width={20} height={20} />
        </button>
      )}
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
