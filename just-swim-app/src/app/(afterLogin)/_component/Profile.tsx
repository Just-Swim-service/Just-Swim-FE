import Image from 'next/image';
import styled from './profile.module.scss';

interface Props {
  customers: { name: string; profile: string }[];
  width: number;
  height: number;
  xMargin: number;
}
export default function Profile({
  customers,
  width,
  height,
  xMargin = -5,
}: Props) {
  return (
    <div className={styled.img_list}>
      {/* <Image src={`/assets/profile1.png`} alt="프로필" width={40} height={40} /> */}
      {customers.map((el, index) => {
        return el.profile ? (
          <Image
            key={index}
            src={`/assets/${el.profile}.png`}
            alt="프로필"
            width={width}
            height={height}
            style={{ margin: `0px ${xMargin}px` }}
          />
        ) : (
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
  );
}
