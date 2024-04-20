import Image from 'next/image';
import './header.scss';
import Link from 'next/link';

interface Props {
  leftContent?: string;
  user: { name: string; image: string };
}
export default function Header({ leftContent, user }: Props) {
  return (
    <>
      <header>
        <div className="leftContent">{leftContent}</div>
        {/* 프로필일 때는 유저 정보에서 식별 정보를 통해 url 이동 */}
        <Link href={`/`}>
          <div className="profileLink">
            <Image src={user.image} alt={user.image} />
          </div>
        </Link>
      </header>
    </>
  );
}
