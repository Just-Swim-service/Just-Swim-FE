import Link from 'next/link';
import Image from 'next/image';

import { getCachedMyProfile } from '@apis';

import styled from './styles.module.scss';

/**
 * 상위 컴포넌트에서 HistoryBackHeader 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} title header의 title
 * @param {string} image user icon의 url
 */
export async function UserIconHeader({
  title,
}: {
  title: string;
}) {
  const profileInfo = await getCachedMyProfile();

  return (
    <header className={styled.header}>
      <div className={styled.title_wrapper}>
        <h1>{title}</h1>
      </div>
      <Link href={`/account`}>
        <div className={styled.profile_image}>
          <Image src={profileInfo?.profileImage || '/assets/profile1.png'} alt={profileInfo?.name} width={34} height={34} />
        </div>
      </Link>
    </header>
  );
}
