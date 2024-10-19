'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { IconLocation, IconRepeat } from '@assets';
import { LectureProps } from '@types';
import { numberFormat, randomId } from '@utils';
import { getLectureDetail } from '@apis';

import NoProfile from '@/_assets/images/no_profile.png';

import styled from './styles.module.scss';

export function ClassDetailItem({
  schedule,
  type
}: {
  schedule: LectureProps,
  type: string,
}) {
  const [mounted, setMounted] = useState(false);
  const [instructor, setInstructor] = useState<{
    instructorName: string,
    instructorProfileImage: string,
  }>();

  const startTime = parseInt(schedule.lectureTime.split(":")[0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const getDetail = async () => {
      const result = await getLectureDetail(parseInt(schedule.lectureId));

      setInstructor(result?.instructor);
    }

    getDetail();
  }, [schedule.lectureId]);

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
            {
              mounted && type === 'instructor' &&
              <p className={styled.class_info}>{schedule.lectureContent}</p>
            }
          </div>
          <>
            {
              mounted &&
              <>
                {
                  type === 'instructor' ? 
                  <div className={styled.student_info}>
                    {
                      schedule.members?.map((student: { memberUserId: string, memberProfileImage: string }) => (
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
                      schedule.members && schedule.members.length !== 0 
                      ?
                      <div
                        className={styled.student_count}
                        style={{ color: `${schedule.lectureColor}` }}>
                        <p>{schedule.members.length}명</p>
                      </div>
                      :
                      <div className={styled.empty_student}>
                        <p>초대된 수강생이 없습니다</p>
                      </div>
                    }
                  </div> : 
                  <div className={styled.student_info}>
                    <div className={styled.instructor_name}>
                      <p>{`${instructor?.instructorName} 강사`}</p>
                    </div>
                    <div className={styled.instructor_image}>
                      <Image
                        src={instructor?.instructorProfileImage || NoProfile}
                        alt={`${instructor?.instructorName}`}
                        width={20}
                        height={20}
                      />
                    </div>
                  </div>
                }
              </>
            }
          </>
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