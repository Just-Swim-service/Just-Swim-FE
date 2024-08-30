import styled from './customerClass.module.scss';
import RepeatTime from '@assets/repeat_time.svg';
import Location from '@assets/location.svg';
import Day from '@assets/day.svg';
import AccountBox from '@assets/account_box.svg';

export default function customerClass() {
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
  ];

  return (
    <>
      <p className={styled.title}>
        <span>
          <AccountBox />
        </span>
        소속된 수업
      </p>
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
            </div>
          </div>
        ))}
      </div>
      <div className={styled.line}></div>
    </>
  );
}
