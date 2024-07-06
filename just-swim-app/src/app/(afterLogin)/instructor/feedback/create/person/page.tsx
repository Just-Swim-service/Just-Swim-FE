'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import addIcon from '@assets/add.png';
import profile from '@assets/profile1.png';
import deleteButton from '@assets/delete_button.png';

import styled from './feedbackWrite.module.scss';
import {
  Header,
  DateInput,
  FileInput,
  TextInput,
  TextArea,
  SelectPersonInput,
  LinkInput,
} from '@components';

import { IconCalendar } from '@assets';

export default function FeedbackWrite() {
  const fileRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    console.log('fileRef', fileRef);
    fileRef?.current?.click();
  };

  const [images, setImages] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent) => {
    const targetFiles = (e.target as HTMLInputElement).files as FileList;
    const targetFilesArray = Array.from(targetFiles);
    const selectedFiles: string[] = targetFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });
    // 합체!
    setImages((prev) => prev.concat(selectedFiles));
  };

  return (
    <>
      <Header title="개별 피드백 작성하기" />
      <div className={styled.feedback_write}>
        <div className={styled.inner}>
          <div className={styled.select_customer}>
            <div className={styled.title}>
              수강생 선택하기 <span>(필수)</span>
            </div>
            <div className={styled.sub_title}>
              피드백을 남길 수강생의 정보를 확인해주세요
            </div>
            <SelectPersonInput name="fileinput" />
          </div>
        </div>

        <div className={styled.divider}></div>

        <div className={styled.feedback_content}>
          <div className={styled.wrap}>
            <div className={styled.title}>
              피드백 기준 수업일 <span>(필수)</span>
            </div>
            <DateInput
              name="dateinput"
              renderIcon={() => <IconCalendar width={14} height={14} />}
              placeholder="수업 일자를 선택해주세요"
              suffix="종료"
            />
          </div>
          <div className={styled.wrap}>
            <div className={styled.title}>첨부 파일</div>
            <div className={`${styled.sub_title} ${styled.file}`}>
              최대 4개의 20MB 이하 파일만 첨부 가능합니다
            </div>
            <FileInput name="fileinput" />
          </div>

          <div className={styled.wrap}>
            <div className={styled.title}>첨부 링크</div>
            <LinkInput
              name="textinput"
              placeholder="첨부하고자 하는 URL을 입력해주세요"
            />
          </div>

          <div className={styled.wrap}>
            <div className={styled.title}>
              피드백 남기기 <span>(필수)</span>
            </div>
            <TextArea
              name="textarea"
              placeholder="피드백을 입력해주세요"
              height={100}
            />
          </div>
        </div>
      </div>
      <button className={styled.submit_btn}>전송하기</button>
    </>
  );
}
