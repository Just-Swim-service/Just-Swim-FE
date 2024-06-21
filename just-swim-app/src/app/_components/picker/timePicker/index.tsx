'use client';

import { useEffect, useState } from 'react';

import { numberFormat } from '@utils';

import styled from './styles.module.scss';

import { VerticalScroll } from './components';

interface TimePickerPrope {
  value: string,
  setValue: (time: string) => void,
  itemHeight?: number,
  itemsToShow?: number,
  paddingY?: number,
}

const generateHourItems = () => {
  return new Array(24).fill(0).map((_, index) => {
    return {
      value: numberFormat(index + 1),
      selected: false
    }
  })
}

const generateMinuteItems = () => {
  return new Array(60).fill(0).map((_, index) => {
    return {
      value: numberFormat(index),
      selected: false
    }
  })
}

export function TimePicker({
  value,
  setValue,
  itemHeight = 60,
  itemsToShow = 3,
  paddingY = 50,
}: TimePickerPrope) {
  const [hour, setHour] = useState<string>('' + (parseInt(value.slice(0, 2)) - 1));
  const [minute, setMinute] = useState<string>(value.slice(3, 6));

  if (itemsToShow / 2 === 0) {
    itemsToShow += 1;
  }

  useEffect(() => {
    setValue(`${numberFormat(parseInt(hour) + 1)}:${minute}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour, minute]);

  return (
    <div className={styled.time_picker}>
      <div className={styled.time_picker_container} style={{
        height: itemHeight * itemsToShow + paddingY * 2,
          padding: `${paddingY}px 0`
      }}>
        <div className={styled.selected_overlay} style={{
          top: itemHeight * ((itemsToShow - 1) / 2) + paddingY,
          height: itemHeight
        }} />
          <VerticalScroll
            value={hour}
            setValue={setHour}
            items={generateHourItems()}
            itemHeight={itemHeight}
            itemsToShow={itemsToShow}
          />
          <VerticalScroll
            value={minute}
            setValue={setMinute}
            items={generateMinuteItems()}
            itemHeight={itemHeight}
            itemsToShow={itemsToShow}
          />
      </div>
    </div>
  )
}