'use client';

import styled from './feedbackDetail.module.scss';

import Send from '@assets/send.svg';
import Calendar from '@assets/calendar.svg';
import FeedbackCalendar from '@/_assets/svg/feedback_calendar.svg';
import NoProfile from '@/_assets/images/no_profile.png';
import UserTypeIndividual from '@assets/user_type_individual.svg';
import UserTypeGroup from '@assets/user_type_group.svg';
import { IconArrowRightSmall, IconDefaultProfile } from '@assets';
import Link from '@assets/link.svg';

import { HistoryBackHeader, ImageFocusModal } from '@components';
import { useEffect, useState } from 'react';
import { getMyProfile, getFeedbackDetail } from '@apis';
import { FeedbackInfo, Members } from '@/_types/typeFeedback';
import { useParams } from 'next/navigation';
import { useModal } from '@hooks';
import { FeedbackTargetListModal } from '../../_components/feedbackTargetListModal';
import Image from 'next/image';

export default function FeedbackDetail() {
  const id = useParams();
  console.log(id);

  const [type, setType] = useState<string>('');
  const [feedbackInfo, setFeedbackInfo] = useState<FeedbackInfo>();
  const [feedbackTarget, setFeedbackTarget] = useState<Members[]>([]);
  const [feedbackCreatedAt, setFeedbackCreatedAt] = useState<string>('');
  const { modal, showModal, hideModal } = useModal();

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const setUserType = async () => {
      const data = await getMyProfile();
      setType(data.data.data.userType);
    };
    setUserType();
  }, []);

  const formatDate = (date: string | undefined): string => {
    if (!date) {
      return '';
    }
    const [year, month, day] = date.split('.');
    return `${year}년 ${month}월 ${day}일`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await getFeedbackDetail(id.id as string);
        setFeedbackInfo(data?.feedback[0]);
        setFeedbackTarget(data?.feedbackTargetList);

        const formattedDate = new Date(data?.feedback[0]?.feedbackCreatedAt)
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, '.');
        setFeedbackCreatedAt(formattedDate);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
  };

  const feedbackDate = formatDate(feedbackInfo?.feedbackDate);

  return (
    <>
      {type === 'instructor' ? (
        <>
          <HistoryBackHeader
            title="피드백 상세 보기"
            additionalLink={`/feedback/edit/${id}`}
            additionalContent="수정하기"
          />
          <div className={styled.detail_container}>
            <div className={styled.feedback_date}>
              <span className={styled.icon}>
                <Send />
              </span>
              <p>{feedbackCreatedAt} 전송된 피드백</p>
            </div>
            <div className={styled.detail_title}>
              <p>피드백 기준일</p>
            </div>
            <div className={styled.detail_content}>
              <span className={styled.detail_icon}>
                <Calendar />
              </span>
              <p>{feedbackDate}</p>
            </div>
            <div className={styled.detail_title}>
              <p>피드백 대상</p>
            </div>
            <div className={styled.detail_content}>
              <span className={styled.detail_icon}>
                {feedbackTarget.length > 1 ? (
                  <UserTypeGroup />
                ) : (
                  <UserTypeIndividual />
                )}
              </span>
              <p>
                {feedbackTarget.length > 1
                  ? `${feedbackTarget[0]?.memberName} 외 ${feedbackTarget.length - 1} 명`
                  : `${feedbackTarget[0]?.memberName}`}
              </p>
              <span onClick={showModal} className={styled.arrow_icon}>
                <IconArrowRightSmall fill="black" />
              </span>
              {modal && (
                <FeedbackTargetListModal
                  feedbackTargetList={feedbackTarget}
                  hideModal={hideModal}
                />
              )}
            </div>
            <div>
              {feedbackInfo?.images && feedbackInfo.images.length > 0 && (
                <div className={styled.detail_title}>
                  <p>첨부 파일</p>
                  <div className={styled.detail_photo}>
                    {feedbackInfo?.images.map((image, index) => (
                      <div
                        key={index}
                        className={styled.preview_item}
                        onClick={() => handleImageClick(index)}
                        style={{
                          backgroundImage: `url(${image.imagePath.trim()})`,
                          width: '100px',
                          height: '100px',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </div>
                  {showImageModal && feedbackInfo?.images && (
                    <ImageFocusModal
                      imageUrl={
                        feedbackInfo?.images[selectedImageIndex]?.imagePath
                      }
                      images={feedbackInfo.images.map(
                        (image) => image.imagePath,
                      )}
                      currentIndex={selectedImageIndex}
                      onClose={handleCloseModal}
                    />
                  )}
                </div>
              )}
            </div>
            {feedbackInfo?.feedbackLink && (
              <div>
                <div className={styled.detail_title}>
                  <p>첨부 링크</p>
                </div>
                <div className={styled.detail_content}>
                  <span className={styled.detail_icon}>
                    <Link />
                  </span>
                  <p>{feedbackInfo?.feedbackLink}</p>
                </div>
              </div>
            )}
            <div className={styled.detail_title}>
              <p>피드백</p>
            </div>
            <div className={styled.detail_content}>
              <p>{feedbackInfo?.feedbackContent}</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <HistoryBackHeader title="피드백 상세 기록" />
          <div className={styled.detail_container}>
            <div className={styled.detail_customer_feedback}>
              <div className={styled.detail_customer_feedback_title}>
                <div className={styled.class_title}>
                  {feedbackInfo?.lectureTitle}
                </div>
                <div className={styled.feedback_type}>
                  {feedbackInfo?.feedbackType === 'personal'
                    ? '개별 피드백'
                    : '단체 피드백'}
                </div>
              </div>
              <div className={styled.instructor_info}>
                <div className={styled.instructor_image}>
                  <Image
                    src={
                      // @ts-ignore
                      feedbackInfo?.instructor?.instructorProfileImage ||
                      NoProfile
                    }
                    // @ts-ignore
                    alt={`${feedbackInfo?.instructor?.instructorName}`}
                    width={24}
                    height={24}
                  />
                </div>
                <div className={styled.instructor_name}>
                  {/* @ts-ignore */}
                  <p>{`${feedbackInfo?.instructor?.instructorName} 강사 수업`}</p>
                </div>
              </div>
            </div>
            <div className={styled.feedback_divider} />
            <div className={styled.detail_customer_feedback_info}>
              <div className={styled.feedback_customer_date}>
                <p>피드백 기준일</p>
                <div className={styled.feedback_customer_date_info}>
                  <span className={styled.date_info_icon}>
                    <FeedbackCalendar />
                  </span>
                  {feedbackInfo?.feedbackDate
                    ? `${parseInt(feedbackInfo.feedbackDate.split('.')[0])}년 ${parseInt(feedbackInfo.feedbackDate.split('.')[1])}월 ${parseInt(feedbackInfo.feedbackDate.split('.')[2])}일`
                    : ''}
                </div>
              </div>
              <div>
                {feedbackInfo?.images && feedbackInfo.images.length > 0 && (
                  <div className={styled.detail_title}>
                    <p>첨부 파일</p>
                    <div className={styled.detail_photo}>
                      {/* TODO: 이미지 클릭 시 확대 처리 */}
                      {(feedbackInfo?.images || []).map((image, index) => {
                        return (
                          <div
                            key={index}
                            className={styled.preview_item}
                            style={{
                              backgroundImage: image.imagePath
                                ? `url(${image.imagePath.trim()})`
                                : IconDefaultProfile,
                              width: '100px',
                              height: '100px',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}></div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              {feedbackInfo?.feedbackLink && (
                <div>
                  <div className={styled.detail_title}>
                    <p>첨부 링크</p>
                  </div>
                  <div className={styled.detail_content}>
                    <span className={styled.detail_icon}>
                      <Link />
                    </span>
                    <p>{feedbackInfo?.feedbackLink}</p>
                  </div>
                </div>
              )}
              <div className={styled.detail_title}>
                <p>피드백</p>
              </div>
              <div className={styled.detail_content}>
                <p>{feedbackInfo?.feedbackContent}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
