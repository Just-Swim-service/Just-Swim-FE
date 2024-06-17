import Image from 'next/image';
import Link from 'next/link';

import './styles.scss';

type User = {
  name: string;
  image: string;
};

interface Props {
  leftContent?: string;
  data: User;
}
export function ProfileHeader({ leftContent, data }: Props) {
  return (
    <>
      <div className="profile_header">
        <div className="left_content">{leftContent}</div>
        <Link href={`/`}>
          <div className="link_to_profile">
            <Image src={data.image} alt={data.image} width={34} height={34} />
          </div>
        </Link>
      </div>
    </>
  );
}
