'use client';

import Link from 'next/link';
import styled from './styles.module.scss';
import Image from 'next/image';

/**
 * 상위 컴포넌트에서 HistoryBackHeader 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} title header의 title
 * @param {string} image user icon의 url
 */
export function UserIconHeader({
  title,
  image = '/assets/profile1.png',
}: {
  title: string,
  image?: string,
}) {
  return (
    <header className={styled.header}>
      <div className={styled.title_wrapper}>
        <h1>{title}</h1>
      </div>
      <Link href={`/`}>
        <div className={styled.profile_image}>
          <Image src={image} alt={image} width={34} height={34} />
        </div>
      </Link>
    </header>
  )
}