'use client';

import React, { useState } from 'react';
import Link from '@assets/link.svg';
import styled from './feedbackConfirm.module.scss';
import { Header, ProfileCard } from '@components';
import { feedbackStore } from '@/_store/feedback';
import { searchClassStore } from '@store';
import { postFeedback } from '@apis';
import { useRouter } from 'next/navigation';
import { fetchJson } from '@utils';

export default function ClassFeedbackConfirm() {
  // @ts-ignore
  const { resetClassData } = searchClassStore();
  const { getFeedbackFormData } = feedbackStore();
  const rawFormData = getFeedbackFormData();
  const formDataState = rawFormData || {};
  const target = JSON.parse(formDataState?.targets ?? '[]');
  const [checked, setChecked] = useState(false);

  const totalMembersCount = Array.isArray(target)
    ? target.reduce((acc, cur) => acc + (cur?.members?.length || 0), 0)
    : 0;

  const router = useRouter();

  const handleSubmit = async () => {
    const feedbackTarget: any[] = [];
    const lectureIdList = target.map((item: any) => item.lectureId);

    for (let i = 0; i < lectureIdList.length; i++) {
      const lectureId = lectureIdList[i];

      try {
        const result = await fetchJson<{
          success: boolean;
          message: string;
          data: any[];
        }>(`/lecture/memberList/${lectureId}`);

        const members = result?.data;

        if (!Array.isArray(members)) {
          console.warn(
            `lectureId ${lectureId}의 멤버 목록이 배열이 아님`,
            members,
          );
          continue;
        }

        const validUserIds = members
          .map((item: any) => Number(item.userId))
          .filter((id) => !isNaN(id));

        if (validUserIds.length === 0) continue;

        feedbackTarget.push({
          lectureId: Number(lectureId),
          userIds: validUserIds,
        });
      } catch (err) {
        console.error(`lectureId ${lectureId} 수강생 조회 실패:`, err);
      }
    }

    try {
      const response = await postFeedback(formDataState, feedbackTarget);

      if (response && response.status === 200) {
        resetClassData();
        router.push('/feedback');
        window.location.href = '/feedback';
      } else {
        console.error('Feedback submission failed:', response);
      }
    } catch (error) {
      console.error('Error processing feedback response:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Header title="작성 내역 확인" />
      <div className={styled.confirm_msg}>
        전송된 피드백은 삭제가 불가능하니 <br />
        내용을 다시 한번 확인해 주세요.
      </div>
      <div className={styled.divide}></div>

      <div className={styled.feedback_confirm}>
        <div className={styled.feedback_content}>
          <div className={`${styled.wrap} ${styled.row}`}>
            <div className={styled.title}>
              선택 수강생: <span>{totalMembersCount}</span>
            </div>
            <div className={styled.tag}>
              {target?.length > 0 ? (
                <div>{target[0]?.lectureTitle} 전체</div>
              ) : (
                <div>{target[0]?.lectureTitle}</div>
              )}
              <ProfileCard
                customers={target[0]?.members || []}
                width={20}
                height={20}
                count={false}
              />
            </div>
          </div>
          <div className={styled.wrap}>
            <div className={styled.title}>
              피드백 기준 수업일: <span>{formDataState.date}</span>
            </div>
          </div>
          <div className={`${styled.wrap} ${styled.col}`}>
            <div className={styled.title}>
              첨부 파일:
              <span>
                {formDataState.files ? formDataState.files.length : 0}개
              </span>
            </div>
            <div className={styled.preview_wrapper}>
              {(formDataState.files || []).map((preview: any, index: number) => {
                const isVideo = preview.fileURL?.match(
                  /\.(mp4|webm|ogg|mov|avi)$/i,
                );

                return (
                  <div key={index} className={styled.preview_item}>
                    {isVideo ? (
                      <video
                        src={preview.fileURL}
                        controls
                        className={styled.preview_video}
                      />
                    ) : (
                      <img
                        src={preview.fileURL}
                        alt={`preview-${index}`}
                        className={styled.preview_image}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`${styled.wrap} ${styled.col}`}>
            <div className={styled.title}>
              첨부 링크: <span>{formDataState.link == '' ? '0' : 1} 개</span>
            </div>
            <div className={`${styled.link}`}>
              <Link className={styled.svg} />
              <input type="text" defaultValue={formDataState.link} />
              {/* <LinkInput name='confirm_link' link={ formDataState.link} /> */}
            </div>
          </div>

          <div className={`${styled.wrap} ${styled.col}`}>
            <div className={styled.title}>피드백 내용:</div>
            <textarea
              placeholder="피드백을 입력해주세요"
              className={styled.feedback_area}
              defaultValue={formDataState.content}></textarea>
          </div>
        </div>
        <div className={styled.confirm_check}>
          <input
            id="confirm"
            type="checkbox"
            checked={checked}
            onChange={(e) => (checked ? setChecked(false) : setChecked(true))}
          />
          <label htmlFor="confirm">작성 내용을 확인했습니다.</label>
        </div>
      </div>

      <div className={styled.btn_wrap}>
        <button onClick={handleBack} className={styled.back_btn}>
          돌아가기
        </button>
        <button
          className={styled.submit_btn}
          disabled={!checked}
          onClick={handleSubmit}>
          전송
        </button>
      </div>
    </>
  );
}
