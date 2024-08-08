'use client';

import { useEffect, useState } from 'react';

import { numberFormat } from '@utils';
import { TimePickerProps } from '@types';

import styled from './styles.module.scss';

import { VerticalSlider } from '@components';

const generateMeridiemItems = () => {
  return [
    {
      value: "AM",
    },
    {
      value: "PM"
    }
  ];
}

const generateHourItems = () => {
  return new Array(12).fill(0).map((_, index) => {
    return {
      value: numberFormat(index === 0 ? 12 : index),
    };
  })
}

const generateMinuteItems = () => {
  return new Array(60).fill(0).map((_, index) => {
    return {
      value: numberFormat(index),
    };
  })
}

export function TimePicker({
  value,
  setValue,
  itemHeight = 60,
  itemsToShow = 3,
  paddingY = 50,
}: TimePickerProps) {
  const hourValue = parseInt(value.slice(0, 2));
  const minuteValue = value.slice(3, 6);

  const [meridiem, setMeridiem] = useState(hourValue >= 12 ? "01" : "00");
  const [hour, setHour] = useState<string>(numberFormat(hourValue % 12));
  const [minute, setMinute] = useState<string>(minuteValue);

  if (itemsToShow / 2 === 0) {
    itemsToShow += 1;
  }
  
  useEffect(() => {
    const meridiemValue = meridiem === "01" ? 12 : 0;

    setValue(`${numberFormat(meridiemValue + parseInt(hour))}:${minute}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meridiem, hour, minute]);

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
          <VerticalSlider
            value={meridiem}
            setValue={setMeridiem}
            items={generateMeridiemItems()}
            itemHeight={itemHeight}
            itemsToShow={itemsToShow}
          />
          <VerticalSlider
            value={hour}
            setValue={setHour}
            items={generateHourItems()}
            itemHeight={itemHeight}
            itemsToShow={itemsToShow}
          />
          <VerticalSlider
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