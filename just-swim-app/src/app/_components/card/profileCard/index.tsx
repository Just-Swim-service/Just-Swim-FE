import Image from 'next/image';

import styled from './profile.module.scss';

interface Props {
  customers: { name: string; profile: string }[];
  width: number;
  height: number;
  xMargin?: number;
  count?: boolean;
}

export function ProfileCard({
  customers,
  width,
  height,
  xMargin = -3,
  count = false,
}: Props) {
  return (
    <div className={styled.row}>
      <div className={styled.img_list}>
        {customers?.map((el, index) => {
          const profileSrc = el.profile || '/assets/no_profile.png';
          return (
            <Image
              key={index}
              src={profileSrc}
              alt={`${el.name} 프로필`}
              width={width}
              height={height}
              className={styled.profile_img}
              style={{
                margin: `0px ${xMargin}px`,
                objectFit: 'cover',
              }}
            />
          );
        })}
      </div>
      {count && (
        <div className={styled.count} style={{ marginLeft: '9px' }}>
          {customers?.length}명
        </div>
      )}
    </div>
  );
}
