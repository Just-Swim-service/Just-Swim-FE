'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import arrowBackIcon from '@assets/icon_arrow_back.png';
import { HistoryBackHeaerProps } from '@types';

import styled from './styles.module.scss';

/**
 * 상위 컴포넌트에서 HistoryBackHeader 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} title header의 title
 * @param {string} additionalLink header에서 추가적으로 사용하는 링크
 * @param {string} additionalContent header에서 추가적으로 사용하는 링크의 내용
 */
export function HistoryBackHeader({
  title,
  routerBackUrl,
  additionalLink = '',
  additionalContent = '',
}: HistoryBackHeaerProps) {
  const router = useRouter();

  const goBack = () => {
    if (routerBackUrl) {
      return router.replace(routerBackUrl);
    }
    router.back();
  };

  return (
    <header className={styled.header}>
      <div className={styled.title_wrapper}>
        <Image src={arrowBackIcon} alt="뒤로가기" onClick={() => goBack()} />
        <h1>{title}</h1>
      </div>
      {additionalLink ? (
        <Link href={additionalLink}>
          <span className={styled.additional}>{additionalContent}</span>
        </Link>
      ) : (
        <></>
      )}
    </header>
  );
}
