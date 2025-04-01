'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Header } from '@components';
import { FeedbackInfo } from '@/_types/typeFeedback';
import {
  SelectPersonInput,
  DateInput,
  FileInput,
  LinkInput,
  TextArea,
} from '@components';
import { formSchema, FormType } from '@/_schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { getClassList, getFeedbackDetail, getFeedbackPresignedURL } from '@apis';
import { feedbackStore } from '@/_store/feedback';

import styled from './feedbackInfoEdit.module.scss';
import { IconCalendar } from '@assets';

interface CustomFormData {
  date: string;
  files: File[] | null;
  targets: string;
  link: string | null | undefined;
  content: string;
}

export default function FeedbackInfoEdit() {
  const params = useParams();
  const router = useRouter();
  const feedbackId = params.id as string;

  // react-hook-form 사용
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const [feedback, setFeedback] = useState<FeedbackInfo | null>(null);
  const [members, setMembers] = useState<any>();
  const { setFeedbackFormData } = feedbackStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await getFeedbackDetail(feedbackId);

        if (data && data.feedback.length > 0) {
          const feedback = data.feedback[0];
          setFeedback(feedback);
          const target = data.feedbackTargetList[0];

          reset({
            date: feedback.feedbackDate || '',
            content: feedback.feedbackContent || '',
            link: feedback.feedbackLink || '',
            target: target
              ? JSON.stringify([
                  {
                    memberId: target.memberId,
                    lectureId: target.lectureId,
                    userId: target.memberUserId,
                    lectureTitle: target.lectureTitle,
                    memberNickname: target.memberName,
                    profileImage: target.memberProfileImage,
                  },
                ])
              : '',
          });
        }
      } catch (error) {
        console.error('feedback 상세 정보 가져오던 중 에러 발생', error);
      }
    };
    fetchData();
  }, [feedbackId, reset]);

  useEffect(() => {
    const getMembersData = async () => {
      // 수강생 목록 조회 - 이름 순서, 반 순서
      const data = await getClassList().then((res) => res.data);
      if (data.success) {
        // 반정보가 함께 저장해야한다.
        const memberData: any = data.data.flatMap((d: any) =>
          d.members.map((member: any) => ({
            ...member,
            lectureTitle: d.lectureTitle, // lectureTitle 추가
          })),
        );
        setMembers(memberData);
      }
    };
    getMembersData();
  }, []);

  const onSubmit = async (data: FormType) => {
    // 파일 업로드 처리
    if (data.file && data.file.length > 0) {
      for (const image of data.file) {
        try {
          const presignedURL = await getFeedbackPresignedURL([image.name]);
          if (!presignedURL) {
            throw new Error('Presigned URL을 가져오지 못했습니다.');
          }

          const response = await fetch(presignedURL[0].presignedUrl, {
            method: 'PUT',
            body: image,
            headers: {
              'Content-Type': image.type,
            },
          });

          if (!response.ok) {
            throw new Error('파일 업로드 실패');
          }
          image.fileURL = presignedURL[0].presignedUrl.split('?')[0];
        } catch (error) {
          return null;
        }
      }
    }

    // 폼 데이터 객체 생성
    const formDataObject: CustomFormData = {
      date: data.date,
      targets: data.target,
      link: data.link,
      content: data.content,
      files: data.file,
    };

    setFeedbackFormData(formDataObject, `${feedback?.feedbackType}`);
    return router.push('/feedback/create/confirm');
  };

  return (
    <div>
      <Header title="피드백 수정하기" />

      <form onSubmit={handleSubmit(onSubmit)} className={styled.feedback_write}>
        <div className={styled.inner}>
          <div className={styled.select_customer}>
            <div className={styled.title}>
              수강생 선택하기 <span>(필수)</span>
            </div>
            <div className={styled.sub_title}>
              피드백을 남길 수강생의 정보를 확인해주세요
            </div>
            <SelectPersonInput
              {...register('target')}
              members={members}
              setValue={setValue}
              errors={[errors.target?.message ?? '']}
            />
          </div>
        </div>

        <div className={styled.divider}></div>

        <div className={styled.feedback_write}>
          <div className={styled.feedback_content}>
            <div className={styled.wrap}>
              <div className={styled.title}>
                피드백 기준 수업일 <span>(필수)</span>
              </div>
              <DateInput
                renderIcon={() => <IconCalendar width={14} height={14} />}
                placeholder="수업 일자를 선택해주세요"
                {...register('date')}
                defaultValue={feedback?.feedbackDate}
                // @ts-ignore
                errors={[errors.date?.message ?? '']}
              />
            </div>

            <div className={styled.wrap}>
              <div className={styled.title}>첨부 파일</div>
              <FileInput
                {...register('file')}
                defaultImages={
                  feedback?.images?.map((img) => img.imagePath) || []
                }
                // @ts-ignore
                setValue={setValue}
              />
            </div>

            <div className={styled.wrap}>
              <div className={styled.title}>첨부 링크</div>
              <LinkInput
                placeholder="첨부하고자 하는 URL을 입력해주세요"
                {...register('link')}
                value={feedback?.feedbackLink}
                // @ts-ignore
                errors={[errors.link?.message ?? '']}
              />
            </div>

            <div className={styled.wrap}>
              <div className={styled.title}>
                피드백 남기기 <span>(필수)</span>
              </div>
              <TextArea
                placeholder="피드백을 입력해주세요"
                height={100}
                {...register('content')}
                // @ts-ignore
                errors={[errors.content?.message ?? '']}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`${styled.submit_btn} ${!isValid ? styled.disabled : ''}`}
          disabled={!isValid}>
          작성완료
        </button>
      </form>
    </div>
  );
}
