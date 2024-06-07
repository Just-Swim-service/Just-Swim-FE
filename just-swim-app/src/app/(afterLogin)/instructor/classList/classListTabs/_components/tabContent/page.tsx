import Image from 'next/image';
import styled from './tabContent.module.scss';
import RepeatTime from '@assets/repeat_time.svg';
import Location from '@assets/location.svg';
import Day from '@assets/day.svg';

export default function TabContent() {
  let classList = [
    {
      name: '아침 5 반',
      target: '초보반으로, 배영 및 접영 위주로 수업합니다.',
      location: '강동구 실내 수영장',
      week: '매주 금,토 요일',
      time: '11:00 ~ 12:00',
      picker: '#F1554C',
    },
    {
      name: '아티스틱 스윔 반',
      target:
        '중급반으로, 수영에 대한 기초적인 지식이 있는 분들을 대상으로 수업하고 있습니다.',
      location: '강동구 실내 수영장',
      week: '매주 금,토 요일',
      time: '11:00 ~ 12:00',
      picker: '#8B41FF',
    },
    {
      name: '생존 수영 반',
      target:
        '왕초보반으로, 수영을 한번도 경험해보지 않은 분을 위주로 수업합니다.',
      location: '왕십리 스윔센터',
      week: '매주 금,토 요일',
      time: '11:00 ~ 12:00',
      picker: '#FFC700',
    },
  ];
  let completeList = [
    {
      name: '생존 수영 반',
      target:
        '왕초보반으로, 수영을 한번도 경험해보지 않은 분을 위주로 수업합니다.',
      location: '왕십리 스윔센터',
      week: '매주 금,토 요일',
      time: '11:00 ~ 12:00',
      picker: '#d7dbde',
    },
  ];
  return (
    <>
      <p className={styled.title}>진행 중인 수업</p>
      <div className={styled.tab_list}>
        {classList.map((item) => (
          <div
            key={item.name}
            className={styled.tab_content}
            style={{ boxShadow: `0px -3px 0 0 ${item.picker}` }}>
            <div className={styled.text_content}>
              <p className={styled.name}>{item.name}</p>
              <p className={styled.target}>{item.target}</p>
              <div className={styled.info}>
                <p>
                  <span className={styled.icon}>
                    <Location />
                  </span>
                  {item.location}
                </p>
                <p>
                  <span className={styled.icon}>
                    <Day />
                  </span>
                  {item.week}
                </p>
                <p>
                  <span className={styled.icon}>
                    <RepeatTime />
                  </span>
                  {item.time}
                </p>
              </div>
              <div className={styled.profile_box}>
                <div className={styled.photo_list}>
                  <Image
                    src={`/assets/no_profile.png`}
                    alt="프로필"
                    width={28}
                    height={28}
                  />
                  <Image
                    src={`/assets/no_profile.png`}
                    alt="프로필"
                    width={28}
                    height={28}
                  />
                  <Image
                    src={`/assets/no_profile.png`}
                    alt="프로필"
                    width={28}
                    height={28}
                  />
                </div>
                <p>15명</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styled.bar}></div>
      <p className={styled.title}>지난 수업</p>
      <div className={styled.tab_list}>
        {completeList.map((item) => (
          <div
            key={item.name}
            className={styled.tab_content}
            style={{ boxShadow: `0px -3px 0 0 ${item.picker}` }}>
            <div className={styled.text_content}>
              <p className={styled.name}>{item.name}</p>
              <p className={styled.target}>{item.target}</p>
              <div className={styled.info}>
                <p>
                  <span className={styled.icon}>
                    <Location />
                  </span>
                  {item.location}
                </p>
                <p>
                  <span className={styled.icon}>
                    <Day />
                  </span>
                  {item.week}
                </p>
                <p>
                  <span className={styled.icon}>
                    <RepeatTime />
                  </span>
                  {item.time}
                </p>
              </div>
              <div className={styled.profile_box}>
                <div className={styled.photo_list}>
                  <Image
                    src={`/assets/no_profile.png`}
                    alt="프로필"
                    width={28}
                    height={28}
                  />
                  <Image
                    src={`/assets/no_profile.png`}
                    alt="프로필"
                    width={28}
                    height={28}
                  />
                  <Image
                    src={`/assets/no_profile.png`}
                    alt="프로필"
                    width={28}
                    height={28}
                  />
                </div>
                <p>15명</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
