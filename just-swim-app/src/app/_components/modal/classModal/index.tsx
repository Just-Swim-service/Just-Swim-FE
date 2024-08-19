import { MouseEvent } from "react";

import { ClassDetailItem, ModalBody } from "@components";
import { LectureProps } from "@types";
import { randomId } from "@utils";

import styled from './styles.module.scss';

const days = ["일", "월", "화", "수", "목", "금", "토"];

export function ClassModal({
  hideModal,
  selectedDate,
  scheduleInfo
}: {
  hideModal: (event: MouseEvent<HTMLElement>) => void,
  selectedDate: string,
  scheduleInfo: LectureProps[]
}) {
  const date = new Date(selectedDate);

  return (
    <ModalBody
      hideModal={hideModal}
    >
      <div className={styled.list}>
        <div className={styled.info}>
          <span>{date.getDate()},</span>
          <span className={`${styled.date} ${date.getDay() === 6 && styled.blue} ${date.getDay() === 0 && styled.red}`}>{days[date.getDay()]}</span>
        </div>
        {
          scheduleInfo.length !== 0 ?
          scheduleInfo.map(schedule => {
            return (
              <ClassDetailItem
                key={randomId()}
                schedule={schedule}
              />
            )
          }): 
          <div>
            <p>등록된 수업이 없습니다.</p>
          </div>
        }
      </div>
    </ModalBody>
  )
}