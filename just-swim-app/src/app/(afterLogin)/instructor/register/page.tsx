// 'use client';

import './classRegister.scss';
import ClassInfo from '../../_component/ClassInfo';
import TextField from '@/app/_component/TextField';
import Warning from '@assets/warning_img.svg';
// import { useState } from 'react';

export default function ClassRegister() {
  // const [check, setCheck] = useState(false);
  // const handleRegisterButton = () => {
  //   setCheck(!check);
  // };

  const check = true;

  return (
    <div className="register_section">
      <div className="register_inner">
        <div className="register_class_info">
          {/* 글자수 안내 메시지 추가 필요 */}
          <div>
            <TextField
              label="수업명"
              placeholder="수업명을 입력해 주세요"
              type="text"
            />
          </div>
          <div>
            <TextField
              label="수업 설명"
              placeholder="수업 정보를 입력해 주세요"
              type="text"
            />
          </div>
        </div>
      </div>
      <div className="line"></div>
      <div className="register_inner">
        <ClassInfo islabel={true} bgColor={'gray'} />
      </div>
      <div className="register_error">
        <Warning />
        <p>이미 같은 일정으로 등록된 수업이 있습니다.</p>
      </div>
      <button
        // onClick={handleRegisterButton}
        className={`register_btn ${check ? 'active' : ''}`}>
        수업 등록
      </button>
    </div>
  );
}
