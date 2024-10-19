'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { randomId } from '@utils';

// @ts-ignore
import { FeedbackProps } from '../../server';

// import EmptyProfile from './empty_profile.png';
import NoProfile from '@/_assets/images/no_profile.png';
import IconCalendar from '@assets/calendar.svg';

import IconIndividual from '@assets/individual.svg';
import IconGroup from '@assets/group.svg';

import styled from './styles.module.scss';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@store';
import { CutomerFeedbackCard } from '@components';

// 한 페이지에 몇 개의 아이템을 보여줄지 여부
// 추후 수정 요망
const itemsToShow = 5;

// 몇 개의 페이지 선택 버튼을 보여줄지 여부
// 추후 수정 요망
const pagesToShow = 5;

// _components 폴더 내부나 페이지 폴더 내부 _components 폴더로 이동
function FeedbackCard({ feedback }: { feedback: FeedbackProps }) {
  const selectedMember = feedback.members[0];
  const router = useRouter();
  const goToFeedbackDetail = (feedbackId: string) => {
    router.push(`feedback/feedbackDetail/${feedbackId}`);
  };
  return (
    <div
      className={styled.feedback_item}
      onClick={() => goToFeedbackDetail(feedback.feedbackId)}>
      <div className={styled.header}>
        <div className={styled.image_wrapper}>
          <Image
            src={
              !!selectedMember ? selectedMember.memberProfileImage : NoProfile
            }
            alt={`${!!selectedMember ? selectedMember.memberNickname : '사용자'} 프로필 이미지`}
            width={22}
            height={22}
          />
        </div>
        <div className={styled.feedback_to}>
          {feedback.feedbackType === 'group' ? (
            <p>
              <span>{feedback.lectureTitle || '선택된 수업이 없습니다.'}</span>
              <span>{' 전체에게'}</span>
            </p>
          ) : (
            <p>
              <span>
                {!!selectedMember
                  ? `${selectedMember.memberNickname}님`
                  : '선택된 사용자가 없습니다.'}
              </span>
              <span>{`${feedback.members.length > 1 ? ` 외 ${feedback.members.length - 1}명` : ''}`}</span>
              <span>에게</span>
            </p>
          )}
        </div>
      </div>
      <div className={styled.content}>
        <p>{feedback.feedbackContent}</p>
      </div>
      <div className={styled.info}>
        <div className={styled.date_wrapper}>
          <IconCalendar />
          <p>{`${parseInt(feedback.feedbackDate.split('.')[1])}월 ${parseInt(feedback.feedbackDate.split('.')[2])}일`}</p>
        </div>
        <div className={styled.target_wrapper}>
          {feedback.feedbackType === 'group' ? (
            <IconGroup />
          ) : (
            <IconIndividual />
          )}
          <p>{`${feedback.feedbackType === 'group' ? '단체 피드백' : '개인 피드백'}`}</p>
        </div>
      </div>
    </div>
  );
}

// 피드백 리스트
// 현재는 문제가 없지만 추후 피드백 개수가 많아지면 초기 응답 속도가 느려지는 문제가 있음
// 추후 리팩토링 때 페이지네이션을 프론트에서 처리하는 것이 아니라 백엔드에서 처리할 필요가 있음
// express 내부에서 캐싱을 통해 처리하면 문제는 없어보임
export function List({ feedback, token }: { feedback: FeedbackProps[] | [], token: string }) {
  const { getUserType } = useUserStore();

  const type = getUserType(token);

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const maxPage = Math.floor(feedback.length / itemsToShow);
  const maxPagination = Math.floor(maxPage / pagesToShow);

  const [page, setPage] = useState<number>(0);
  const [pagination, setPagination] = useState<number>(0);

  const onClickPage = (page: number) => {
    setPage(page);
  };

  const onClickPrev = () => {
    setPagination((s) => s - 1);
  };

  const onClickNext = () => {
    setPagination((s) => s + 1);
  };

  useEffect(() => {
    setPage(pagination * itemsToShow);
  }, [pagination]);

  return (
    <div className={styled.wrap}>
      {
        mounted && type === 'instructor' && 
        <div className={styled.text}>
          <div className={styled.title}>이전 기록</div>
          <div>시간 순으로 수강생에게 남긴 기록을 확인할 수 있습니다.</div>
        </div>
      }
      <div className={styled.container}>
        <div className={styled.list}>
          {feedback
            .slice(page * itemsToShow, (page + 1) * itemsToShow)
            .map((feedback) => {
              return (
                <div key={randomId()}>
                  {
                    mounted &&
                    <>
                      {
                        type === 'instructor' ? 
                        <FeedbackCard feedback={feedback} /> : 
                        <CutomerFeedbackCard feedback={feedback} />
                      }
                    </>
                  }
                </div>
              );
            })}
        </div>
        <div className={styled.page}>
          {pagination !== 0 && (
            <div>
              {/* 추후 svg로 변경 */}
              <button className={styled.move_button} onClick={onClickPrev}>
                {'<'}
              </button>
            </div>
          )}
          {Array(...Array(pagesToShow)).map((_, idx) => {
            const nowPage = pagination * itemsToShow + idx;

            if (nowPage > maxPage) {
              return null;
            }

            return (
              <div key={randomId()}>
                <button
                  className={`${styled.page_button} ${page === nowPage && styled.selected}`}
                  onClick={() => {
                    onClickPage(nowPage);
                  }}>
                  {nowPage + 1}
                </button>
              </div>
            );
          })}
          {pagination !== maxPagination && (
            <div>
              {/* 추후 svg로 변경 */}
              <button className={styled.move_button} onClick={onClickNext}>
                {'>'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
