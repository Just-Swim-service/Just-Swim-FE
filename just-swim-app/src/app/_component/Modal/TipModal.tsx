'use client';

import './tipModal.scss';
import ColorPicker from './_component/ColorPicker';
import { Dispatch, SetStateAction, useState } from 'react';
import Link from 'next/link';

export default function TipModal({
  setShowModal,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [next, setNext] = useState('1');
  const handleTipModal = () => {
    setNext('2');
  };
  const handleShowModal = () => {
    setShowModal(false);
  };
  return (
    <div className="tip_modal">
      <div className="modal_background">
        <div className="modal">
          <div className="modal_header">
            <div className="circle_1">1</div>
            <p>-</p>
            <div className={`circle_2 ${next === '2' ? 'active' : ''}`}>2</div>
          </div>
          <div className="modal_title">
            <div>작성 꿀팁</div>
            <div>
              {next === '1' ? (
                <h3>
                  수업명은 파악하기 쉽게
                  <br />
                  고유 정보로 입력하는게 좋아요
                </h3>
              ) : (
                <h3>
                  수업 종료일을 설정하지 않으면
                  <br />
                  일정이 계속 반복돼요
                </h3>
              )}
            </div>
          </div>
          <div className="tip_modal_footer">
            <div className="button_wrapper">
              {next === '1' ? (
                <button
                  className="select_button active"
                  onClick={handleTipModal}>
                  다음
                </button>
              ) : (
                <Link
                  href={{
                    pathname: `/instructor/register`,
                  }}>
                  <button
                    className="select_button active"
                    onClick={handleShowModal}>
                    확인
                  </button>
                </Link>
              )}
            </div>
            <div className="button_wrapper">
              {next === '1' ? (
                <Link
                  href={{
                    pathname: `/instructor/register`,
                  }}>
                  <button className="select_button" onClick={handleShowModal}>
                    건너뛰기
                  </button>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
