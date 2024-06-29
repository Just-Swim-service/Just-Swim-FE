'use client';

import { COLOR_LIST } from '@data';
import { IconValidWhite } from '@assets';

import styled from './styles.module.scss';

export function ColorPicker({
  selected,
  change,
}: {
  selected: string,
  change: (color: string) => void
}) {
  return COLOR_LIST.map((el, index) => {
    return (
      <button
        key={index}
        className={styled.color_picker}
        style={{ backgroundColor: `${el.color}` }}
        onClick={() => change(el.color)}
      >
        {selected === el.color && <IconValidWhite width={16} height={11} />}
      </button>
    );
  });
}
