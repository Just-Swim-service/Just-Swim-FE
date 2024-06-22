'use client';

import { MouseEvent, useState } from 'react';

import { ConfirmButton } from '@components';
import { randomId } from '@utils';

import styled from './styles.module.scss';

interface DayProps {
  "monday": boolean,
  "tuesday": boolean,
  "wednesday": boolean,
  "thursday": boolean,
  "friday": boolean,
  "saturday": boolean,
  "sunday": boolean,
  [props: string]: any,
}

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
}: {
  initialDays: DayProps,
  hideModal: (event: MouseEvent<HTMLButtonElement>) => void,
  setDays: (days: DayProps) => void,
}) {
  const [selectedDays, setSelectedDays] = useState<DayProps>({
    ...initialDays
  });

  const changeSelectedDay = (day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday") => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };
  
  const preventDefault = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  }

  const confirmSelectedDays = (event: MouseEvent<HTMLButtonElement>) => {
    setDays({
      ...selectedDays
    });
    hideModal(event);
  }

  return (
    <div className={styled.modal_wrapper} onClick={preventDefault}>
      <div className={styled.modal}>
        <button
          className={styled.modal_top_btn}
          onClick={hideModal}>
          <div />
        </button>
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
        <div className={styled.modal_btn}>
          <ConfirmButton text='취소' kind='confirm-sub' onClick={hideModal} />
          <ConfirmButton text='변경' kind='confirm' onClick={confirmSelectedDays} />
        </div>
      </div>
    </div>
  )
}