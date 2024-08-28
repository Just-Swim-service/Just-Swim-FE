'use client';

import { MouseEvent, useState } from 'react';

import styled from './styles.module.scss';

export function SlideSwitch({
  defaultState = 'off',
  onChange = () => {},
}: {
  defaultState?: 'on' | 'off',
  onChange?: () => void,
}) {
  const [state, setState] = useState<boolean>(defaultState === 'on' ? true : false);
  
  const onClickButton = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setState(s => !s);
    onChange();
  }

  return (
    <button className={styled.button} onClick={onClickButton}>
      <div className={`${styled.switch_body} ${state && styled.on}`} />
      <div className={`${styled.switch_circle} ${state && styled.on}`} />
    </button>
  )
}