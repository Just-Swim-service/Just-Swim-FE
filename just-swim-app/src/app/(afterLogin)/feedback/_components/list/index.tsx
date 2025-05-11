'use client';

import { useEffect, useState } from 'react';
import styled from './styles.module.scss';
import { FeedbackProps } from '@types';
import { FeedbackCard } from '../feedbackCard';
import { CustomerFeedbackCard } from '../customerFeedbackCard';
import { getMyProfile } from '@apis';

const itemsToShow = 5;
const pagesToShow = 5;

export function List({ feedback = [] }: { feedback: FeedbackProps[] | [] }) {
  const [type, setType] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [pagination, setPagination] = useState<number>(0);

  useEffect(() => {
    const setUserType = async () => {
      const data = await getMyProfile();
      setType(data.data.data.userType);
    };
    setUserType();
  }, []);

  const maxPage = Math.ceil(feedback.length / itemsToShow) - 1;
  const maxPagination = Math.floor(maxPage / pagesToShow);

  const onClickPage = (page: number) => {
    setPage(page);
  };

  const onClickPrev = () => {
    setPagination((prev) => prev - 1);
  };

  const onClickNext = () => {
    setPagination((prev) => prev + 1);
  };

  useEffect(() => {
    setPage(pagination * itemsToShow);
  }, [pagination]);

  const paginationButtons = Array.from({ length: pagesToShow }, (_, idx) => {
    const nowPage = pagination * pagesToShow + idx;

    if (nowPage > maxPage) return null;

    return (
      <div key={idx}>
        <button
          className={`${styled.page_button} ${page === nowPage && styled.selected}`}
          onClick={() => onClickPage(nowPage)}>
          {nowPage + 1}
        </button>
      </div>
    );
  });

  return (
    <div className={styled.wrap}>
      {type === 'instructor' ? (
        <>
          <div className={styled.text}>
            <div className={styled.title}>이전 기록</div>
            <div>시간 순으로 수강생에게 남긴 기록을 확인할 수 있습니다.</div>
          </div>
          <div className={styled.container}>
            <div className={styled.list}>
              {feedback
                .slice(page * itemsToShow, (page + 1) * itemsToShow)
                .map((item, idx) => (
                  <div key={idx}>
                    <FeedbackCard feedback={item} />
                  </div>
                ))}
            </div>
            <div className={styled.page}>
              {pagination > 0 && (
                <button className={styled.move_button} onClick={onClickPrev}>
                  {'<'}
                </button>
              )}
              {paginationButtons}
              {pagination < maxPagination && (
                <button className={styled.move_button} onClick={onClickNext}>
                  {'>'}
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {feedback.length > 0 && (
            <div className={styled.text}>
              <div className={styled.title_customer}>피드백 기록</div>
              <div>시간 순으로 수강생에게 남긴 기록을 확인할 수 있습니다.</div>
            </div>
          )}
          <div className={styled.container}>
            {feedback.length === 0 ? (
              <div className={styled.empty_wrap}>
                <p className={styled.empty_text}>이전 기록이 없습니다</p>
              </div>
            ) : (
              <>
                <div className={styled.list}>
                  {feedback
                    .slice(page * itemsToShow, (page + 1) * itemsToShow)
                    .map((item, idx) => (
                      <div key={idx}>
                        <CustomerFeedbackCard feedback={item} />
                      </div>
                    ))}
                </div>
                <div className={styled.page}>
                  {pagination > 0 && (
                    <button className={styled.move_button} onClick={onClickPrev}>
                      {'<'}
                    </button>
                  )}
                  {paginationButtons}
                  {pagination < maxPagination && (
                    <button className={styled.move_button} onClick={onClickNext}>
                      {'>'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
