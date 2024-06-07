'use client';

import { SetStateAction, useState } from 'react';
import EditHeader from '@/app/_component/header/EditHeader';
import styled from './delete.module.scss';
import DeleteModal from '@/app/_component/Modal/DeleteModal';

export default function Delete() {
  const [selectedRadio, setSelectedRadio] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleRadioChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedRadio(event.target.value);
    if (event.target.value === '기타') {
      setShowInput(true);
    } else {
      setShowInput(false);
    }
  };

  const clickModal = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <>
      <EditHeader leftContent="계정 탈퇴" data={{ dataUrl: '/' }} />
      <div className={styled.delete_container}>
        <div>
          <h1>탈퇴하는 이유가 무엇인가요?</h1>
          <h2>더 나은 서비스가 될 수 있도록 의견을 들려주세요.</h2>
          <form action="#">
            {[
              '더 이상 사용하지 않는 앱이에요.',
              '기능이 유용하지 않아요.',
              '오류가 생겨서 쓸 수 없어요.',
              '개인 정보 공개가 불안해요.',
              '다른 유사 서비스를 이용 중이에요.',
            ].map((reason) => (
              <label key={reason}>
                <input
                  type="radio"
                  name="delete"
                  value={reason}
                  checked={selectedRadio === reason}
                  onChange={handleRadioChange}
                />
                {reason}
              </label>
            ))}
            <label>
              <input
                type="radio"
                name="delete"
                value="기타"
                checked={selectedRadio === '기타'}
                onChange={handleRadioChange}
              />
              기타
              {showInput && (
                <input type="text" placeholder="내용을 입력해주세요." />
              )}
            </label>
            <button disabled={!selectedRadio} onClick={clickModal}>
              확인
            </button>
          </form>
        </div>
        {showModal && (
          <DeleteModal showModal={showModal} setShowModal={setShowModal} />
        )}
      </div>
    </>
  );
}
