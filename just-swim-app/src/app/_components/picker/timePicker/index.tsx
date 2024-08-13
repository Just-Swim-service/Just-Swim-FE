'use client';

import { useEffect, useMemo, useState } from 'react';

import { numberFormat } from '@utils';
import { TimePickerProps } from '@types';
import { VerticalSlider, VerticalSliderLoop } from '@components';

import styled from './styles.module.scss';

const itemHeight = 60;
const itemsToShow = 3;

const generateMeridiemItems = () => {
  return ["AM", "PM"];
}

const generateHourItems = () => {
  return new Array(12).fill(0).map((_, index) => {
    return numberFormat(index);
  })
}

const generateMinuteItems = () => {
  return new Array(60).fill(0).map((_, index) => {
    return numberFormat(index);
  })
}

export function TimePicker({
  value,
  updateValue,
}: TimePickerProps) {
  const hourValue = parseInt(value.slice(0, 2));
  const minuteValue = value.slice(3, 6);

  const [meridiem, setMeridiem] = useState(hourValue >= 12 ? "PM" : "AM");
  const [hour, setHour] = useState<string>(numberFormat(hourValue % 12));
  const [minute, setMinute] = useState<string>(minuteValue);
  
  useEffect(() => {
    const meridiemValue = meridiem === "PM" ? 12 : 0;

    updateValue(`${numberFormat(meridiemValue + parseInt(hour))}:${minute}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meridiem, hour, minute]);

  const meridiemList = useMemo(() => generateMeridiemItems(), []);

  const updateMeridiem = (medium: string) => {
    setMeridiem(medium);
  }

  const hourList = useMemo(() => generateHourItems(), []);

  const updateHour = (hour: string) => {
    setHour(hour);
  }

  const minuteList = useMemo(() => generateMinuteItems(), []);

  const updateMinute = (minute: string) => {
    setMinute(minute);
  }

  return (
    <div className={styled.container}>
      <VerticalSlider
        itemList={meridiemList}
        initialItem={meridiem}
        updateItem={updateMeridiem}
        itemHeight={itemHeight}
        itemsToShow={itemsToShow}
        useBorder={true}
      />
      <VerticalSliderLoop
        itemList={hourList}
        initialItem={hour}
        updateItem={updateHour}
        itemHeight={itemHeight}
        itemsToShow={itemsToShow}
        useBorder={true}
      />
      <VerticalSliderLoop
        itemList={minuteList}
        initialItem={minute}
        updateItem={updateMinute}
        itemHeight={itemHeight}
        itemsToShow={itemsToShow}
        useBorder={true}
      />
    </div>
  )
}