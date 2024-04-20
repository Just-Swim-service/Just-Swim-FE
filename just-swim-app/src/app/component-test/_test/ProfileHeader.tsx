import Image from 'next/image';
import './header.scss';
import Link from 'next/link';

type User = {
  name: string;
  image: string;
};

interface Props {
  leftContent?: string;
  data: User;
}
export default function ProfileHeader({ leftContent, data }: Props) {
  return (
    <>
      <header>
        <div className="leftContent">{leftContent}</div>
        <Link href={`/`}>
          <div className="linkToProfile">
            <Image src={data.image} alt={data.image} />
          </div>
        </Link>
      </header>
    </>
  );
}
