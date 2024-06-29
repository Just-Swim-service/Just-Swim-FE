"use client";

import { MouseEvent, useState } from 'react';

import { ColorPicker, ConfirmModal } from '@components';

import styled from './styles.module.scss';

export function ColorModal({
  initialColor,
  hideModal,
  setColor
}: {
  initialColor: string,
  hideModal: (event: MouseEvent<HTMLButtonElement>) => void,
  setColor: (color: string) => void,
}) {
  // color 선택 관련
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);

  const changeSelectedColor = (color: string) => {
    setSelectedColor(color);
  }

  const confirmSelectedColor = (event: MouseEvent<HTMLButtonElement>) => {
    setColor(selectedColor);
    hideModal(event);
  }

  return (
    <ConfirmModal 
      hideModal={hideModal} 
      confirmCallback={confirmSelectedColor}
    >
      <div className={styled.modal}>
        <div className={styled.modal_title}>
          <p className="">구분 색</p>
          <p className="">스케쥴 정보 구분에 사용됩니다.</p>
        </div>
        <div className={styled.color_list}>
          <ColorPicker
            selected={selectedColor}
            change={changeSelectedColor}
          />
        </div>
      </div>
    </ConfirmModal>
  );
}
