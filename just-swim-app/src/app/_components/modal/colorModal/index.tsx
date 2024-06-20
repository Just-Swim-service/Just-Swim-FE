"use client";

import { MouseEvent, useState } from 'react';

import { ColorPicker, ConfirmButton } from '@components';

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

  const preventDefault = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  }

  return (
    <div className={styled.modal_wrapper} onClick={preventDefault}>
      <div className={styled.modal}>
        <button
          className={styled.modal_top_btn}
          onClick={hideModal}>
          <div />
        </button>
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
        <div className={styled.modal_btn}>
          <ConfirmButton text='취소' kind='confirm-sub' onClick={hideModal} />
          <ConfirmButton text='변경' kind='confirm' onClick={confirmSelectedColor} />
        </div>
      </div>
    </div>
  );
}
