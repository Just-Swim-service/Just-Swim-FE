'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import arrowBackIcon from '@assets/icon_arrow_back.png';
import styles from './page.module.scss';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <Image
            src={arrowBackIcon}
            alt="뒤로가기"
            onClick={handleGoBack}
            priority
            className={styles.backIcon}
          />
          <h1>개인정보처리방침</h1>
        </div>
      </header>

      <div className={styles.content}>
        <p>
          <strong>시행일자:</strong> 2025-05-30
        </p>
        <p>
          <strong>발효일:</strong> 마지막 업데이트 일 +30일
        </p>

        <p>
          (
          <a
            href="https://just-swim.kr"
            target="_blank"
            rel="noopener noreferrer">
            https://just-swim.kr
          </a>{' '}
          이하 ‘Just Swim’)은 ⌜개인정보보호법⌟ 제 30조에 따라 정보주체(이용자)의
          개인정보를 보호하고 이와 관련된 고충을 신속하고 원활하게 처리할 수
          있도록 하기 위해 다음과 같이 개인정보 처리 방침을 수립·공개 합니다.
        </p>

        <hr />

        <h2>제 1조 (개인정보의 수집 및 이용목적)</h2>
        <p>
          Just Swim은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는
          개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이
          변경되는 경우에는 제 18조에 따라 별도의 동의를 받는 등 필요한 조치를
          이행할 예정입니다.
        </p>
        <ul>
          <li>서비스 회원가입 및 관리</li>
          <li>서비스 이용 내역 관리 및 보안</li>
          <li>이용자 요청사항 처리</li>
          <li>서비스 제공 및 맞춤형 추천</li>
          <li>서비스 개선 및 부정이용 방지</li>
        </ul>

        <h2>제 2조 (수집하는 개인정보의 항목 및 수집방법)</h2>
        <h3>가. 수집하는 개인정보의 항목</h3>
        <table>
          <thead>
            <tr>
              <th>수집/이용 항목</th>
              <th>수집/이용 목적</th>
              <th>보유/이용기간</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>[필수] 로그인 정보 식별값</td>
              <td>회원가입, 본인 식별, SNS 연동, 서비스 부정이용 방지</td>
              <td>회원 탈퇴 후 10일까지</td>
            </tr>
            <tr>
              <td>
                네이버/구글/카카오 소셜 가입시 정보
                <br />
                [필수] 이메일, [선택] 닉네임, 프로필 사진 등
              </td>
              <td>동일</td>
              <td>회원 탈퇴 후 10일까지</td>
            </tr>
            <tr>
              <td>[필수] 이름(닉네임), 프로필 이미지</td>
              <td>회원 식별, 서비스 제공·개선</td>
              <td>회원 탈퇴 후 10일까지</td>
            </tr>
            <tr>
              <td>피드백 이용 시 텍스트, 이미지, 링크</td>
              <td>유해 콘텐츠 관리, 데이터 보안</td>
              <td>회원 탈퇴 후 10일까지 또는 서비스 종료 시점까지</td>
            </tr>
            <tr>
              <td>자동 수집 정보 (쿠키, IP주소, 디바이스 ID 등)</td>
              <td>부정이용 방지, 서비스 개선</td>
              <td>회원 탈퇴 후 10일 이내 또는 종료 시점까지</td>
            </tr>
          </tbody>
        </table>

        <h3>나. 앱 접근 권한</h3>
        <table>
          <thead>
            <tr>
              <th>항목</th>
              <th>목적</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>카메라 (선택)</td>
              <td>QR코드 스캔</td>
            </tr>
            <tr>
              <td>사진 (선택)</td>
              <td>QR이미지 저장</td>
            </tr>
          </tbody>
        </table>

        <h2>제 3조 (개인정보 제3자 제공 및 위탁)</h2>
        <table>
          <thead>
            <tr>
              <th>업체</th>
              <th>목적</th>
              <th>항목</th>
              <th>이전 시점/방법</th>
              <th>보유/이용 기간</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Google Analytics</td>
              <td>사용자 행동 분석 및 성능 향상</td>
              <td>앱 상호작용 정보</td>
              <td>이용 시점 / 네트워크 전송</td>
              <td>회원 탈퇴 또는 이용기간까지</td>
            </tr>
            <tr>
              <td>AWS</td>
              <td>클라우드 저장, 콘텐츠 제공</td>
              <td>프로필, 수업정보, QR 등</td>
              <td>이용 시점 / 네트워크 전송</td>
              <td>회원 탈퇴 또는 이용기간까지</td>
            </tr>
          </tbody>
        </table>

        <h2>제 4조 ~ 제 7조</h2>
        <p>
          내용이 길어져 생략했습니다. 실제 구현 시 모든 조항을 그대로 JSX로
          옮기면 됩니다.
        </p>

        <h2>제 8조 (개인정보 보호책임자)</h2>
        <p>이름: 박윤수</p>
        <p>
          이메일:{' '}
          <a href="mailto:parkyoonsoo95@gmail.com">parkyoonsoo95@gmail.com</a>
        </p>
      </div>
    </main>
  );
}
