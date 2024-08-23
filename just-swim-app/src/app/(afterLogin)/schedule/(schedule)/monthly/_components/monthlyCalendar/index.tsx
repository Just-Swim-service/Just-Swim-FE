import React from "react";

import { randomId } from "@utils";

import styled from './styles.module.scss';

function _MonthlyCalendar({
  days,
  itemHeight,
  y
}: {
  days: JSX.Element[],
  itemHeight: number
  y: number
}) {

  return (
    <div className={styled.calendar_container}>
      <div 
        className={styled.calendar}
        style={{
          transform: `translateY(${y}px)`
        }}
      >
        {
          days.map(d => {
            return (
              <div key={randomId()} className={styled.item_container} style={{ height: itemHeight }}>
                {d}
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export const MonthlyCalendar = React.memo(_MonthlyCalendar);