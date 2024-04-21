import Image from 'next/image';
import './profile.scss';

interface Props {
  customers: {name: string, profile: string}[]
}
export default function Profile({customers} : Props) {

  return (
    // <div className="img_list">
    //   {/* <Image src={`/assets/profile1.png`} alt="프로필" width={40} height={40} /> */}
    //   {peopleList.map((el, index) => {
    //     return (
    //       <Image
    //         key={index}
    //         src={`/assets/${el.profile}.png`}
    //         alt="프로필"
    //         width={32}
    //         height={32}
    //       />
    //     );
    //   })}
    // </div>

    <div className="img_list">
      {/* <Image src={`/assets/profile1.png`} alt="프로필" width={40} height={40} /> */}
      {customers.map((el, index) => {
        return el.profile ? (
          <Image
            key={index}
            src={`/assets/${el.profile}.png`}
            alt="프로필"
            width={32}
            height={32}
          />
        ) : (
          <Image
            key={index}
            src={`/assets/no_profile.png`}
            alt="프로필"
            width={32}
            height={32}
          />
        );
      })}
    </div>
  );
}
