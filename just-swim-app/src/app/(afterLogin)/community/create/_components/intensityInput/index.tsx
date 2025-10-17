'use client';

import {
  ForwardedRef,
  InputHTMLAttributes,
  forwardRef,
  useRef,
  useState,
} from 'react';
import { IconInputValid } from '@assets';
import { mergeRefs } from '@utils';

import styled from './styles.module.scss';

interface IntensityInputProps extends InputHTMLAttributes<HTMLInputElement> {
  valid?: boolean;
  errorMessage?: string;
  placeholder?: string;
}

function _IntensityInput(
  {
    name,
    valid = true,
    errorMessage = '',
    placeholder = '선택해주세요',
    ...props
  }: IntensityInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const intensityOptions = [
    { value: '낮음', label: '낮음' },
    { value: '보통', label: '보통' },
    { value: '높음', label: '높음' },
  ];

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);

    // react-hook-form과 연동
    if (inputRef.current) {
      inputRef.current.setAttribute('value', value);
      inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styled.input_wrapper}>
      <div
        className={`${styled.intensity_input} ${!valid ? styled.invalid : ''}`}
        onClick={toggleDropdown}>
        <span
          className={selectedValue ? styled.selected_value : styled.placeholder}>
          {selectedValue || placeholder}
        </span>
        <div
          className={`${styled.arrow} ${isOpen ? styled.arrow_up : styled.arrow_down}`}>
          ▼
        </div>
      </div>

      {selectedValue && valid && (
        <div className={styled.valid_wrapper}>
          <IconInputValid width={18} height={18} />
        </div>
      )}

      {errorMessage && (
        <div className={styled.error_message}>
          <p>{errorMessage}</p>
        </div>
      )}

      {isOpen && (
        <div className={styled.dropdown}>
          {intensityOptions.map((option) => (
            <div
              key={option.value}
              className={`${styled.option} ${selectedValue === option.value ? styled.selected : ''}`}
              onClick={() => handleSelect(option.value)}>
              {option.label}
            </div>
          ))}
        </div>
      )}

      <input
        {...props}
        name={name}
        ref={mergeRefs(inputRef, ref)}
        type="text"
        hidden
        readOnly
        value={selectedValue}
      />
    </div>
  );
}

/**
 * 상위 컴포넌트에서 IntensityInput 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} name input의 name
 * @param {boolean} valid input이 유효한지 여부
 * @param {string} errorMessage 에러 메시지
 * @param {string} placeholder 플레이스홀더 텍스트
 * @param {import('react').MutableRefObject<HTMLInputElement>} ref input의 ref attribute에 연결할 target
 * @param {import('react').InputHTMLAttributes<HTMLInputElement>} attributes input에서 사용 가능한 모든 attributes
 */
export const IntensityInput = forwardRef(_IntensityInput);




