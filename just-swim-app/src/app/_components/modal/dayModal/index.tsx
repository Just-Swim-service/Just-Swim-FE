'use client';

import { MouseEvent, useState } from 'react';

import { ConfirmModal } from '@components';
import { randomId } from '@utils';
import { DayModalProps, DayProps } from '@types';
import { DAY_KOR_TO_ENG, WEEK_DAYS } from '@data';

import styled from './styles.module.scss';

export function DayModal ({
  initialDays,
  hideModal,
  setDays
}: DayModalProps) {
  const [selectedDays, setSelectedDays] = useState<DayProps>({
    ...initialDays
  });

  const changeSelectedDay = (day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday") => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const confirmSelectedDays = (event: MouseEvent<HTMLButtonElement>) => {
    setDays({
      ...selectedDays
    });
    hideModal(event);
  }

  return (
    <ConfirmModal 
      hideModal={hideModal} 
      confirmCallback={confirmSelectedDays}
    >
      <div className={styled.modal}>
        <div className={styled.day_list}>
          {
            WEEK_DAYS.map(day => {
              return (
                <button
                  key={randomId()}
                  className={`${styled.day_button} ${selectedDays[DAY_KOR_TO_ENG[day]] ? styled.selected : ''}`}
                  onClick={() => {
                    changeSelectedDay(DAY_KOR_TO_ENG[day]);
                  }}
                >
                  <span>{day}</span>
                </button>
              )
            })
          }
        </div>
      </div>
    </ConfirmModal>
  )
}