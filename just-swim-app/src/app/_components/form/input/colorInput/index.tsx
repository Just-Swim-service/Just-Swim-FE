'use client';

import { ForwardedRef, InputHTMLAttributes, MouseEvent, forwardRef, useState } from 'react';

import { ColorModal } from '@components';
import { ColorInputProps } from '@types';
import { COLOR_LIST } from '@data';
import { useModal } from '@hooks';

import styled from './styles.module.scss';

function _ColorInput({
  name,
  defaultValue = '',
  ...props
}: ColorInputProps & InputHTMLAttributes<HTMLInputElement>,
ref: ForwardedRef<HTMLInputElement>) {
  // 현재 선택된 색 관련
  const [selectedColor, setSelectedColor] = useState<string>(defaultValue ? defaultValue : COLOR_LIST[0].color);

  const changeSelectedColor = (color: string) => {
    setSelectedColor(color);
  }

  const { modal, showModal, hideModal } = useModal();

  return (
    <div className={styled.input_wrapper}>
      <div className={styled.color_sample} style={{
        backgroundColor: selectedColor
      }} onClick={showModal} />
      <input
        {...props}
        name={name}
        className={styled.color_input}
        ref={ref}
        type='text'
        readOnly
        value={selectedColor}
        onClick={showModal}
      />
      {
        modal && 
        <ColorModal
          initialColor={selectedColor}
          hideModal={hideModal}
          setColor={changeSelectedColor}
        />
      }
      
    </div>
  );
}

/**
 * 상위 컴포넌트에서 ColorInput 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} name input의 name
 * @param {string} defaultValue input의 초기 색상 값, #xxxxxx의 형태
 * @param {import('react').MutableRefObject<HTMLInputElement>} ref input의 ref attribute에 연결할 target
 * @param {import('react').InputHTMLAttributes<HTMLInputElement>} attributes input에서 사용 가능한 모든 attributes
 */
export const ColorInput = forwardRef(_ColorInput);