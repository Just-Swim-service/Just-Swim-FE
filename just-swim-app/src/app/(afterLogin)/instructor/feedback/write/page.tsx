'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Header from '../../../../_component/Header';
import './feedbackWrite.scss';
import addIcon from '/public/assets/add.png';
import profile from '/public/assets/profile1.png';
import Datepicker from '../../../../_component/DatePicker';
import Input from '../../../../_component/Input';
import deleteButton from '/public/assets/delete_button.png';
import Link from 'next/link';

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
      <div className="feedback_write">
        <div className="select_customer">
          <div className="title">
            수강생 선택하기 <span>(필수)</span>
          </div>
          <div className="sub_title">
            피드백을 남길 수강생의 정보를 확인해주세요
          </div>
          <div className="flex">
            <Link
              href={'/instructor/feedback/search/person'}
              className="box add_btn">
              <Image src={addIcon} alt="add" />
              <div className="add_txt">추가하기</div>
            </Link>

            <div className="box">
              <button className="box_delete">
                <Image src={deleteButton} alt="delete" />
              </button>

              <div className="profile">
                <Image src={profile} alt="프로필 이미지" />
                <div className="name">김고독</div>
                <div className="class">아침5반</div>
              </div>
            </div>
            <div className="box">
              <button className="box_delete">
                <Image src={deleteButton} alt="delete" />
              </button>
              <div className="profile">
                <Image src={profile} alt="프로필 이미지" />
                <div className="name">김고독</div>
                <div className="class">아침5반</div>
              </div>
            </div>
            <div className="box">
              <button className="box_delete">
                <Image src={deleteButton} alt="delete" />
              </button>
              <div className="profile">
                <Image src={profile} alt="프로필 이미지" />
                <div className="name">김고독</div>
                <div className="class">아침5반</div>
              </div>
            </div>
            <div className="box">
              <button className="box_delete">
                <Image src={deleteButton} alt="delete" />
              </button>
              <div className="profile">
                <Image src={profile} alt="프로필 이미지" />
                <div className="name">김고독</div>
                <div className="class">아침5반</div>
              </div>
            </div>
          </div>
        </div>

        <div className="feedback_content">
          <div className="wrap">
            <div className="title">
              피드백 기준 수업일 <span>(필수)</span>
            </div>
            <Datepicker bgColor="gray" />
          </div>
          <div className="title">첨부 파일</div>
          <div className="sub_title">
            최대 4개의 20MB 이하 파일만 첨부 가능합니다
          </div>

          <div className="flex">
            {images.map((url, i) => {
              return (
                <div key={url} className="added_file">
                  <Image src={url} width="78" height="78" alt={`image${i}`} />
                </div>
              );
            })}
            {/* <div className="added_file">dd</div> */}
            {/* <div className="added_file">dd</div> */}
            {/* <form method="post" encType="multipart/form-data" className="box"> */}
            <div className="box" onClick={handleClick}>
              <label htmlFor="chooseFile">
                <div className="add">
                  <Image src={addIcon} alt="add" />
                </div>
              </label>
              <input
                type="file"
                id="chooseFile2"
                name="chooseFile"
                accept="image/*"
                multiple
                ref={fileRef}
                onChange={handleChange}
              />
            </div>
            {/* </form> */}
          </div>

          <div className="title">첨부 링크</div>
          <div className="link">
            <input type="text" />
            <button>
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5.10512 17.8216H14.8953L15.4355 6.39307H4.56494L5.10512 17.8216Z"
                  fill="#F8F9FA"
                />
                <path
                  d="M17.8573 4.78557H15.0001V2.99986C15.0001 2.21191 14.3595 1.57129 13.5716 1.57129H6.42871C5.64077 1.57129 5.00014 2.21191 5.00014 2.99986V4.78557H2.143C1.74791 4.78557 1.42871 5.10477 1.42871 5.49986V6.21415C1.42871 6.31236 1.50907 6.39272 1.60728 6.39272H2.9555L3.50684 18.0668C3.54255 18.828 4.17201 19.4284 4.93318 19.4284H15.0671C15.8305 19.4284 16.4577 18.8302 16.4934 18.0668L17.0448 6.39272H18.393C18.4912 6.39272 18.5716 6.31236 18.5716 6.21415V5.49986C18.5716 5.10477 18.2524 4.78557 17.8573 4.78557ZM6.60728 3.17843H13.393V4.78557H6.60728V3.17843ZM14.8952 17.8213H5.10505L4.56487 6.39272H15.4354L14.8952 17.8213Z"
                  fill="#212223"
                />
              </svg>
            </button>
          </div>

          <div className="title">
            피드백 남기기 <span>(필수)</span>
          </div>
          <textarea className="feedback_area"></textarea>
        </div>
      </div>
      <button className="submit_btn">전송하기</button>
    </>
  );
}
