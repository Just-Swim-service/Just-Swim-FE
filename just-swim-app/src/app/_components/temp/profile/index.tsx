import Image from 'next/image';

import styled from './profile.module.scss';

interface Props {
  customers: { name: string; profile: string }[];
  width: number;
  height: number;
  xMargin?: number;
  count?: boolean;
}
export function Profile({
  customers,
  width,
  height,
  xMargin = -3,
  count = false,
}: Props) {
  return (
    <div className={styled.row}>
      <div className={styled.img_list}>
        {/* <Image src={`/assets/profile1.png`} alt="프로필" width={40} height={40} /> */}
        {customers?.map((el, index) => {
          // @ts-ignore
          return el.profileImage ? (
            <div
              key={index}
              className={styled.profile_img}
              style={{
                // @ts-ignore
                backgroundImage: `url(${el.profileImage})`,
                width: width,
                height: height,
                margin: `0px ${xMargin}px`,
              }}
            />
          ) : (
            // <Image
            //   key={index}
            //   src={el.profileImage}
            //   alt="프로필"
            //   width={width}
            //   height={height}
            //   style={{ margin: `0px ${xMargin}px` }}
            // />
            <Image
              key={index}
              src={`/assets/no_profile.png`}
              alt="프로필"
              width={width}
              height={height}
              style={{ margin: `0px ${xMargin}px` }}
            />
          );
        })}
      </div>
      {count ? (
        <div className={styled.count} style={{ marginLeft: '9px' }}>
          {customers?.length}명
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
