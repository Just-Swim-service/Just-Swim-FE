'use client';

import { useState } from "react";

import { LightConfirmModal, MonthPicker } from "@components";
import { MonthModalProps } from "@types";

import styled from './styles.module.scss';

export function MonthModal({
  yearValue,
  monthValue,
  updateValue,
  hideModal,
  unshowModal,
}: MonthModalProps) {
  const [currentValue, setCurrentValue] = useState<{ year: number, month: number }>({
    year: yearValue,
    month: monthValue
  });

  const updateCurrentValue = ({year, month}: { year: number, month: number }) => {
    setCurrentValue({ year, month, });
  }

  const confirmSelectedMonth = () => {
    updateValue({ year: currentValue.year, month: currentValue.month });
    unshowModal();
  }

  return (
    <LightConfirmModal
      confirmCallback={confirmSelectedMonth}
      hideModal={hideModal}
    >
      <div className={styled.container}>
        <MonthPicker
          yearValue={currentValue.year}
          monthValue={currentValue.month}
          updateValue={updateCurrentValue}
        />
      </div>
    </LightConfirmModal>
  )
}