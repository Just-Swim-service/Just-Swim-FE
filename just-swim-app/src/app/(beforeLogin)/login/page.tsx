'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3>안녕하세요 Just Swim 입니다 🏊🏻‍♂️</h3>
        </div>
        <div>
          <p>웰컴투수영랜드</p>
        </div>
      </div>
      {/* TODO: 이미지 넣기 */}
      <div className={styles.section}>
        <div className={styles.buttonWrapper}>
          <button onClick={onClickKakao} className={styles.kakaoButton}>
            카카오로 계속하기
          </button>
        </div>
        <div className={styles.buttonWrapper}>
          <button onClick={onClickNaver} className={styles.naverButton}>
            네이버로 계속하기
          </button>
        </div>
        <div className={styles.buttonWrapper}>
          <button onClick={onClickGoogle} className={styles.googleButton}>
            Google로 계속하기
          </button>
        </div>
      </div>
      <div className={styles.footer}></div>
    </div>
  );
}
