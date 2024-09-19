'use client';

import { ProfileHeader } from '@components';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from './user.module.scss';
import Image from 'next/image';
import {
  IconAccountBox,
  IconCalendar,
  IconCalendarBirth,
  IconClock,
  IconEmail,
  IconHistoryEdu,
  IconLink,
  IconLocation,
  IconPhone,
  IconRepeatTime,
} from '@assets';
import { MemberProps } from '@types';
import Link from 'next/link';
import dayjs from 'dayjs';

export default function User() {
  const params = useParams();

  const memberId = params.id;
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/member/${memberId}`;
  const AUTHORIZATION_HEADER = `${process.env.NEXT_PUBLIC_TOKEN}`;

  const [member, setMember] = useState<MemberProps | null>(null);

  useEffect(() => {
    fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: AUTHORIZATION_HEADER,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMember(data.data);
      });
  }, [memberId]);

  return (
    <>
      <ProfileHeader
        leftContent="수업 정보"
        data={{
          name: '',
          image: '',
        }}
      />

      {member && (
        <>
          <div className={styled.customer_info}>
            <div className={styled.container}>
              <div className={styled.flex}>
                <Image
                  src={member.profileImage}
                  alt="회원 프로필 사진"
                  width={68}
                  height={68}
                  style={{
                    borderRadius: '68px',
                    textAlign: 'center',
                  }}
                />
              </div>
              <p className={styled.name}>{member.name}</p>
              <div className={styled.user_info}>
                <span className={styled.icon}>
                  <IconCalendarBirth width={20} height={20} fill="black" />
                </span>
                <p>{member.birth}</p>
              </div>
              <div className={styled.user_info}>
                <span className={styled.icon}>
                  <IconEmail width={20} height={20} fill="black" />
                </span>
                <p>{member.email}</p>
              </div>
              <div className={styled.user_info}>
                <span className={styled.icon}>
                  <IconPhone width={20} height={20} fill="black" />
                </span>
                <p>{member.phoneNumber}</p>
              </div>
            </div>
          </div>

          <div className={styled.container}>
            <p className={styled.title}>
              <span className={styled.icon}>
                <IconAccountBox width={20} height={20} fill="black" />
              </span>
              소속된 수업
            </p>

            <div className={styled.tab_list}>
              {member.lectures && member.lectures.length > 0 && (
                <>
                  <div className="left_content">
                    {member.lectures.map((item, index) => (
                      <>
                        {index % 2 === 0 && (
                          <div
                            key={item.lectureId}
                            className={styled.tab_content}
                            style={{
                              boxShadow: `0px -3px 0 0 ${item.lectureColor}`,
                            }}>
                            <div className={styled.lectureItem}>
                              <Link
                                href={`/instructor/class/detail/${item.lectureId}`}>
                                <div className={styled.text_content}>
                                  <p className={styled.name}>
                                    {item.lectureTitle}
                                  </p>
                                  <p className={styled.target}>
                                    {item.lectureContent}
                                  </p>
                                  <div className={styled.info}>
                                    <p>
                                      <span className={styled.icon}>
                                        <IconLocation
                                          width="18"
                                          height="18"
                                          fill="#5C5E62"
                                        />
                                      </span>
                                      {item.lectureLocation}
                                    </p>
                                    <p>
                                      <span className={styled.icon}>
                                        <IconClock
                                          width="18"
                                          height="18"
                                          fill="#5C5E62"
                                        />
                                      </span>
                                      {item.lectureDays}
                                    </p>
                                    <p>
                                      <span className={styled.icon}>
                                        <IconRepeatTime
                                          width="18"
                                          height="18"
                                          fill="#5C5E62"
                                        />
                                      </span>
                                      {item.lectureTime}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        )}
                      </>
                    ))}
                  </div>

                  <div className="right_content">
                    {member.lectures.map((item, index) => (
                      <>
                        {index % 2 !== 0 && (
                          <div
                            key={item.lectureId}
                            className={styled.tab_content}
                            style={{
                              boxShadow: `0px -3px 0 0 ${item.lectureColor}`,
                            }}>
                            <div className={styled.lectureItem}>
                              <Link
                                href={`/instructor/class/detail/${item.lectureId}`}>
                                <div className={styled.text_content}>
                                  <p className={styled.name}>
                                    {item.lectureTitle}
                                  </p>
                                  <p className={styled.target}>
                                    {item.lectureContent}
                                  </p>
                                  <div className={styled.info}>
                                    <p>
                                      <span className={styled.icon}>
                                        <IconLocation
                                          width="18"
                                          height="18"
                                          fill="#5C5E62"
                                        />
                                      </span>
                                      {item.lectureLocation}
                                    </p>
                                    <p>
                                      <span className={styled.icon}>
                                        <IconClock
                                          width="18"
                                          height="18"
                                          fill="#5C5E62"
                                        />
                                      </span>
                                      {item.lectureDays}
                                    </p>
                                    <p>
                                      <span className={styled.icon}>
                                        <IconRepeatTime
                                          width="18"
                                          height="18"
                                          fill="#5C5E62"
                                        />
                                      </span>
                                      {item.lectureTime}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styled.container}>
            <p className={styled.title}>
              <span className={styled.icon}>
                <IconHistoryEdu width={20} height={20} fill="black" />
              </span>
              피드백 기록
            </p>
            {member.feedback && member.feedback.length > 0 ? (
              <>
                {member.feedback.map((item, index) => (
                  <div className={styled.feed_box} key={index}>
                    <div className={styled.text_flex}>
                      <p className={styled.day}>
                        <span>
                          <IconCalendar width={20} height={20} fill="black" />
                        </span>
                        {dayjs(item.feedbackDate).format('YYYY년 MM월 DD일')}
                      </p>
                      <div className={styled.text_line}></div>
                      <p className={styled.type}>
                        <span>
                          <IconAccountBox width={20} height={20} fill="black" />
                        </span>
                        {item.feedbackType === 'group'
                          ? '단체 피드백'
                          : '개별 피드백'}
                      </p>
                    </div>
                    <div className={styled.feed_content}>
                      <p className={styled.content}>{item.feedbackContent}</p>
                      <div>
                        <p className={styled.photo}>
                          <div>
                            <Image
                              src={item.images[index].imagePath}
                              alt="피드백 사진"
                              width={76}
                              height={76}
                              style={{
                                borderRadius: '9px',
                              }}
                            />
                          </div>
                          + {item.images.length}장
                        </p>
                      </div>
                    </div>
                    <div className={styled.feed_link}>
                      <span>
                        <IconLink width={16} height={16} fill="#3689FF" />
                      </span>
                      <Link href={`/instructor/feedback/feedbackDetail`}>
                        https://alpha-justswim.netlify.app/instructor/feedback/feedbackDetail
                        {/* 추후 Link 수정 */}
                      </Link>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p>등록된 피드백이 없습니다.</p>
            )}
          </div>

          <div className={styled.container}>
            <div className={styled.button_box}>
              <button className={styled.feed_button}>피드벡 남기기</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
