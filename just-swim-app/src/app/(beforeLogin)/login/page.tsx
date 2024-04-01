'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const type = '';

  // 로컬스토리지 또는 쿠키 확인해서 이미 존재한다면 바로 페이지 이동하기
  const checkCookie = () => {
    console.log('쿠키 또는 로컬스토리지 확인');

    // 쿠키에 접근하여 타입 확인
    if (type) {
      console.log('타입 존재');
      return true;
    } else {
      console.log('타입 없음');
      return false;
    }
  };

  const routeChooseType = () => {
    router.replace('/login/type');
  };

  const onClickGoogle = () => {
    if (checkCookie()) {
      router.replace(`/${type}`);
    } else {
      console.log('구글 로그인');
      routeChooseType();
    }
  };

  const onClickNaver = () => {
    if (checkCookie()) {
      router.replace(`/${type}`);
    } else {
      console.log('네이버 로그인');
      routeChooseType();
    }
  };

  const onClickKakao = () => {
    if (checkCookie()) {
      router.replace(`/${type}`);
    } else {
      console.log('카카오 로그인');
      routeChooseType();
    }
  };

  const onClickApple = () => {
    if (checkCookie()) {
      router.replace(`/${type}`);
    } else {
      console.log('애플 로그인');
      routeChooseType();
    }
  };

  return (
    <div className='container'>
      <header>
        <h3>안녕하세요 Just Swim 입니다 🏊🏻‍♂️</h3>
        <p>웰컴투수영랜드</p>
      </header>
      <main>
        <div>
          <button onClick={onClickGoogle}>구글 로그인</button>
        </div>
        <div>
          <button onClick={onClickNaver}>네이버 로그인</button>
        </div>
        <div>
          <button onClick={onClickKakao}>카카오톡 로그인</button>
        </div>
        <div>
          <button onClick={onClickApple}>애플 로그인</button>
        </div>
      </main>
      <footer>
        빈 공간
      </footer>
    </div>
  );
}
