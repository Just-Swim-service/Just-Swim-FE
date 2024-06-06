'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Header from '@/app/_component/Header';
import addIcon from '/public/assets/add.png';
import Link from '@assets/link.svg';

import styled from './feedbackConfirm.module.scss';

import Profile from '@/app/(afterLogin)/_component/Profile';

export default function ClassFeedbackConfirm() {
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

  // 수업 참여자 리스트
  let peopleList = [
    {
      name: 'hyebin',
      profile: 'profile1',
    },
    {
      name: 'hyebin',
      profile: '',
    },
    {
      name: 'hyebin',
      profile: 'profile1',
    },
  ];

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
              선택 수강생: <span>15명</span>
            </div>
            <div className={styled.tag}>
              <div>아침 5반 전체</div>
              <Profile
                customers={peopleList}
                width={20}
                height={20}
                count={false}
              />
            </div>
          </div>
          {/* <Profile /> */}
          <div className={styled.wrap}>
            <div className={styled.title}>
              피드백 기준 수업일: <span>3월 28, 2024</span>
            </div>
          </div>
          <div className={`${styled.wrap} ${styled.col}`}>
            <div className={styled.title}>
              첨부 파일: <span>2개</span>
            </div>
            <div className={styled.flex}>
              {images.map((url, i) => (
                <div key={url} className={styled.added_file}>
                  <Image src={url} width="78" height="78" alt={`image${i}`} />
                </div>
              ))}
              <div className={styled.box} onClick={handleClick}>
                <label htmlFor="chooseFile2">
                  <div className={styled.add}>
                    <Image src={addIcon} alt="add" />
                  </div>
                </label>
                <input
                  type="file"
                  id="chooseFile2"
                  name="chooseFile2"
                  accept="image/*"
                  multiple
                  ref={fileRef}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className={`${styled.wrap} ${styled.col}`}>
            <div className={styled.title}>
              첨부 링크: <span>2개</span>
            </div>
            <div className={`${styled.link}`}>
              <Link className={styled.svg} />
              <input type="text" />
            </div>
          </div>

          <div className={`${styled.wrap} ${styled.col}`}>
            <div className={styled.title}>피드백 내용:</div>
            <textarea
              placeholder="피드백을 입력해주세요"
              className={styled.feedback_area}></textarea>
          </div>
        </div>
        <div className={styled.confirm_check}>
          <input type="checkbox" name="confirm" id="confirm" />
          <label htmlFor="confirm">작성 내용을 확인했습니다.</label>
        </div>
      </div>

      <div className={styled.btn_wrap}>
        <button className={styled.back_btn}>돌아가기</button>
        <button className={styled.submit_btn}>전송하기</button>
      </div>
    </>
  );
}
