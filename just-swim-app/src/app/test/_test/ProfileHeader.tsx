import Image from 'next/image';
import './header.scss';
import Link from 'next/link';

interface Props {
  leftContent?: string;
  data: { name: string; image: string };
}
export default function ProfileHeader({ leftContent, data }: Props) {
  return (
    <>
      <header>
        <div className="leftContent">{leftContent}</div>
        <Link href={`/`}>
          <div className="profileLink">
            <Image src={data.image} alt={data.image} />
          </div>
        </Link>
      </header>
    </>
  );
}
