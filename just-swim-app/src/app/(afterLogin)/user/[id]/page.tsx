'use client';

import { Header } from '@components';
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
  IconGallery,
} from '@assets';
import NoProfile from '@assets/no_profile.png';
import { MemberProps } from '@types';
import Link from 'next/link';
import dayjs from 'dayjs';
import { fetchJson } from '@utils';

export default function User() {
  const params = useParams();

  const memberId = params.id;

  const [member, setMember] = useState<MemberProps | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!memberId) return;

    const fetchMember = async () => {
      try {
        const res = await fetchJson<{ data: MemberProps }>(
          `/member/${memberId}`,
        );

        const filteredFeedback = (res.data.feedback || []).filter(
          (item) => item.feedbackId !== null,
        );

        const filteredLectures = (res.data.lectures || []).filter(
          (item) => item.lectureId !== null,
        );

        const normalizedData = {
          ...res.data,
          feedback: filteredFeedback,
          lectures: filteredLectures,
        };

        setMember(normalizedData);
      } catch (error) {
        console.error('회원 정보 가져오기 실패:', error);
      }
    };

    fetchMember();
  }, [memberId]);

  const evenLectures = member?.lectures.filter((_, index) => index % 2 === 0);
  const oddLectures = member?.lectures.filter((_, index) => index % 2 !== 0);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  return (
    <>
      <Header title="회원 정보" />

      {member && (
        <>
          <div className={styled.customer_info}>
            <div className={styled.container}>
              <div className={styled.flex}>
                <Image
                  src={
                    imageError || !member?.profileImage
                      ? NoProfile
                      : member.profileImage
                  }
                  alt="회원 프로필 사진"
                  width={68}
                  height={68}
                  style={{
                    borderRadius: '68px',
                    textAlign: 'center',
                  }}
                  priority
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              </div>
              <p className={styled.name}>{member.name}</p>
              {/* <div className={styled.user_info}>
                <span className={styled.icon}>
                  <IconCalendarBirth width={20} height={20} fill="black" />
                </span>
                <p>{member.birth}</p>
              </div> */}
              {/* <div className={styled.user_info}>
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
              </div> */}
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
                    {evenLectures?.map((item) => (
                      <div
                        key={item.lectureId}
                        className={styled.tab_content}
                        style={{
                          boxShadow: `0px -3px 0 0 ${item.lectureColor}`,
                        }}>
                        <div className={styled.lectureItem}>
                          <Link href={`/class/detail/${item.lectureId}`}>
                            <div className={styled.text_content}>
                              <p className={styled.name}>{item.lectureTitle}</p>
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
                    ))}
                  </div>

                  <div className="right_content">
                    {oddLectures?.map((item) => (
                      <div
                        key={item.lectureId}
                        className={styled.tab_content}
                        style={{
                          boxShadow: `0px -3px 0 0 ${item.lectureColor}`,
                        }}>
                        <div className={styled.lectureItem}>
                          <Link href={`/class/detail/${item.lectureId}`}>
                            <div className={styled.text_content}>
                              <p className={styled.name}>{item.lectureTitle}</p>
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
                {member.feedback.map((item) => (
                  <div className={styled.feed_box} key={item.feedbackId}>
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
                            {item.images?.length > 0 ? (
                              item.images.map((image) => (
                                <Image
                                  key={image.imageId}
                                  src={image.imagePath || IconGallery}
                                  alt="피드백 이미지"
                                  width={76}
                                  height={76}
                                  style={{
                                    borderRadius: '9px',
                                  }}
                                  priority
                                />
                              ))
                            ) : (
                              <p> 이미지가 없습니다.</p>
                            )}
                          </div>
                          + {item.images.length}장
                        </p>
                      </div>
                    </div>
                    <div className={styled.feed_link}>
                      <IconLink width={16} height={16} fill="#3689FF" />
                      <a
                        href={item.feedbackLink}
                        target="_blank"
                        rel="noopener noreferrer">
                        {item.feedbackLink}
                      </a>
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
              <Link href="/feedback/create/person">
                <button className={styled.feed_button}>피드백 남기기</button>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
