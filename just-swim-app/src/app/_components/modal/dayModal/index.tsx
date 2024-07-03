'use client';

import { MouseEvent, useState } from 'react';

import { ConfirmModal } from '@components';
import { randomId } from '@utils';
import { DayModalProps, DayProps } from '@types';

import styled from './styles.module.scss';

const days = [
  "월",
  "화",
  "수",
  "목",
  "금",
  "토",
  "일",
];

const dayKorToEng: {[props: string]: any} = {
  "월": "monday",
  "화": "tuesday",
  "수": "wednesday",
  "목": "thursday",
  "금":  "friday",
  "토": "saturday",
  "일": "sunday",
}

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
            days.map(day => {
              return (
                <button
                  key={randomId()}
                  className={`${styled.day_button} ${selectedDays[dayKorToEng[day]] ? styled.selected : ''}`}
                  onClick={() => {
                    changeSelectedDay(dayKorToEng[day]);
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