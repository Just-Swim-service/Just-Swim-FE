import Image from 'next/image';

import { IconLocation, IconRepeat } from '@assets';
import { LectureProps } from '@types';
import { numberFormat, randomId } from '@utils';

import styled from './styles.module.scss';

export function ClassDetailItem({
  schedule
}: {
  schedule: LectureProps,
}) {
  const startTime = parseInt(schedule.lectureTime.split(":")[0]);

  return (
    <div className={styled.container}>
      <div className={styled.time_info}>
        <span className={styled.meridiem}>{startTime < 12 ? '오전' : '오후'}</span>
        <span className={styled.start_time}>{numberFormat(startTime)}시</span>
      </div>
      <div
        className={styled.content}
        style={{ boxShadow: `3px 0 0 0 ${schedule.lectureColor} inset` }}
      >
        <div className={styled.main_info}>
          <div className={styled.title_info}>
            <p
              className={styled.class_name}
              style={{ color: `${schedule.lectureColor}` }}>
              {schedule.lectureTitle}
            </p>
            <p className={styled.class_info}>{schedule.lectureContent}</p>
          </div>
          
          <div className={styled.student_info}>
            {
              schedule.lectureMembers?.map((student: { memberUserId: number, memberProfileImage: string }, index) => (
                <div key={randomId()} className={styled.student}>
                  <Image
                    src={student.memberProfileImage}
                    alt={`${student.memberUserId}`}
                    width={20}
                    height={20}
                  />
                </div>
              ))
            }
            {
              schedule.lectureMembers && schedule.lectureMembers.length !== 0 
              ?
              <div
                className={styled.student_count}
                style={{ color: `${schedule.lectureColor}` }}>
                <p>{schedule.lectureMembers.length}명</p>
              </div>
              :
              <div className={styled.empty_student}>
                <p>초대된 수강생이 없습니다</p>
              </div>
            }
          </div>
        </div>
        <div className={styled.extra_info}>
          <p className={styled.class_day}>
            <IconRepeat width={14} height={14} />
            <span>매주</span>
            <span>{schedule.lectureDays.split('').join(', ')}<span>요일</span></span>
          </p>
          <span></span>
          <p className={styled.class_location}>
            <IconLocation width={14} height={14} />
            <span>{schedule.lectureLocation}</span>
          </p>
        </div>
      </div>
    </div>
  )
}