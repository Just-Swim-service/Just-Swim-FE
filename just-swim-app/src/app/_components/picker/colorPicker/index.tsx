'use client';

import { useState } from 'react';

import { ValidWhiteSVG } from '@components';
import { COLOR_LIST } from '@data';

import styled from './styles.module.scss';

// interface Props {
//   color: [
//     { name: 'primary_blue'; color: '#82D616' },
//     { name: 'red'; color: '#82D616' },
//     { name: 'yellow'; color: '#82D616' },
//     { name: 'green'; color: '#82D616' },
//     { name: 'blue'; color: '#82D616' },
//     { name: 'purple'; color: '#82D616' },
//     { name: 'pink'; color: '#82D616' },
//     { name: 'gray'; color: '#82D616' },
//   ];
// | 'red'
// | 'yellow'
// | 'green'
// | 'blue'
// | 'purple'
// | 'pink'
// | 'gray';
// }

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
        {selected === el.color && <ValidWhiteSVG width={16} height={11} />}
      </button>
    );
  });
}
