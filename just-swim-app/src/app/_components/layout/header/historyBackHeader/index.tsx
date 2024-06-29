'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { ImageArrowBack } from "@assets";

import styled from './styles.module.scss';

/**
 * 상위 컴포넌트에서 HistoryBackHeader 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} title header의 title
 * @param {string} additionalLink header에서 추가적으로 사용하는 링크
 * @param {string} additionalContent header에서 추가적으로 사용하는 링크의 내용
 */
export function HistoryBackHeader({
  title,
  additionalLink = '',
  additionalContent = '',
}: {
  title: string,
  additionalLink?: string,
  additionalContent?: string,
}) {
  const router = useRouter();

  const historyBack = () => {
    router.back();
  };

  return (
    <header className={styled.header}>
      <div className={styled.title_wrapper}>
        <Link href='/' onClick={historyBack}>
          <Image src={ImageArrowBack} alt="뒤로가기" />
        </Link>
        <h1>{title}</h1>
      </div>
      {
        additionalLink &&
        <Link href={additionalLink}>
          <span className={styled.additional}>{additionalContent}</span>
        </Link>
      }
    </header>
  );
}