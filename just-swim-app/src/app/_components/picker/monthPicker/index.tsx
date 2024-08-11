'use client';

import { useEffect, useMemo, useState } from "react";

import { VerticalSlider } from "@components";
import { MonthPickerProps } from "@types";

import styled from './styles.module.scss';

const today = new Date();
const itemHeight = 36;
const itemsToShow = 5;

const generateYearItems = () => {
  return new Array(21).fill(0).map((_, index) => {
    return (today.getFullYear() + index - 10) + '년';
  });
}

const generateMonthItems = () => {
  return new Array(12).fill(0).map((_, index) => {
    return (index + 1) + '월';
  });
}

export function MonthPicker({
  yearValue,
  monthValue,
  updateValue,
}: MonthPickerProps) {
  const [year, setYear] = useState<number>(yearValue);
  const [month, setMonth] = useState<number>(monthValue);

  useEffect(() => {
    updateValue({ year, month });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const yearList = useMemo(() => generateYearItems(), []);

  const updateYear = (year: string) => {
    setYear(parseInt(year.slice(0, -1)));
  }
  
  const monthList = useMemo(() => generateMonthItems(), []);

  const updateMonth = (month: string) => {
    setMonth(parseInt(month.slice(0, -1)) - 1);
  }

  return (
    <div className={styled.container}>
      <div
        className={styled.overlay}
        style={{
          height: itemHeight,
          top: itemHeight * ((itemsToShow - 1) / 2)
        }}
      />
      <VerticalSlider
        itemList={yearList}
        initialItem={year + '년'}
        updateItem={updateYear}
        itemHeight={itemHeight}
        itemsToShow={itemsToShow}
      />
      <VerticalSlider
        itemList={monthList}
        initialItem={(month + 1) + '월'}
        updateItem={updateMonth}
        itemHeight={itemHeight}
        itemsToShow={itemsToShow}
      />
    </div>
  )
}