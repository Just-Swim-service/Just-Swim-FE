import React from 'react';

import { useModal } from '@hooks';
import { IconArrowRightSmall } from '@assets';
import { WEEK_DAYS } from '@data';
import { randomId } from '@utils';
import { MonthModal } from '@components';

import styled from './styles.module.scss';

function _MonthlyInfo({
  currentYear,
  currentMonth,
  setYear,
  setMonth,
}: {
  currentYear: number,
  currentMonth: number,
  setYear: (year: number) => void,
  setMonth: (month: number) => void,
}) {
  // 모달 관련
  const { modal, showModal, unshowModal, hideModal } = useModal();

  const toggleSelectMonth = () => {
    showModal();
  }

  const updateMonth = ({ year, month }: { year: number, month: number }) => {
    setYear(year);
    setMonth(month);
  }

  return (
    <div className={styled.container}>
      <div className={styled.month_info}>
         <p>{currentMonth + 1}월</p>
         <button onClick={toggleSelectMonth}>
           <IconArrowRightSmall
            style={{
              rotate: `${modal ? '90deg' : '0deg'}`
            }}
          />
        </button>
      </div>
      <div className={styled.week_days}>
        {
          WEEK_DAYS.map((d, idx) => {
            return (
              <div
                key={randomId()} 
                className={`${styled.weeek_item} ${idx === 0 && styled.sunday} ${idx === 6 && styled.saturday}`}
              >
                <span>{d}</span>
              </div>
            )
          })
        }
      </div>
      {
        modal &&
        <MonthModal
          yearValue={currentYear}
          monthValue={currentMonth}
          updateValue={updateMonth}
          unshowModal={unshowModal}
          hideModal={hideModal}
        />
      }
    </div>
  )
}

export const MonthlyInfo = React.memo(_MonthlyInfo);