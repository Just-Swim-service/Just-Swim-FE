import { ChangeEvent, ForwardedRef, TextareaHTMLAttributes, forwardRef } from 'react';

import { TextAreaProps } from '@types';

import styled from './styles.module.scss';

function _TextArea({
  name,
  height = 183,
  onChange,
  errors=[],
  ...props
}: TextAreaProps & TextareaHTMLAttributes<HTMLTextAreaElement>,
ref: ForwardedRef<HTMLTextAreaElement>) {
  const autoGrow = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.target.style.height = (event.target.scrollHeight) + "px";
  }

  const onChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(event);
    }

    autoGrow(event);
  }

  return (
    <div className={styled.area_wrapper}>
      <textarea
        {...props}
        ref={ref}
        name={name}
        className={`${styled.textarea_input}`}
        style={{
          minHeight: height,
        }}
        onChange={onChangeHandler}
      />
      <span className={styled.error}>{errors.map((error, index) => <li key={index}>{error}</li>)}</span>
    </div>
  );
}

/**
 * 상위 컴포넌트에서 TextArea 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} name textarea의 name
 * @param {boolean} valid textarea이 유효한지 여부
 * @param {import('react').MutableRefObject<HTMLTextAreaElement>} ref textarea의 ref attribute에 연결할 target
 * @param {import('react').TextareaHTMLAttributes<HTMLTextAreaElement>} attributes textarea에서 사용 가능한 모든 attributes
 */
export const TextArea = forwardRef(_TextArea);