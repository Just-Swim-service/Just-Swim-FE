'use client';

import Header from '@_component/Header';
import styled from './searchClass.module.scss';
import Location from '@assets/location.svg';
import Calendar_SM from '@assets/calendar_sm.svg';
import Clock from '@assets/clock.svg';
import Check from '@assets/check.svg';
import Clear from '@assets/clear.svg';
import { useState } from 'react';

export default function searchClass() {
  const [selected, setSelected] = useState<string | null>(null);

  let classList = [
    {
      id: '1',
      name: '아침 5 반',
      week: '금,토 요일',
      location: '강동구 실내 수영장',
      time: '11:00 ~ 12:00',
    },
    {
      id: '2',
      name: '아티스틱 스윔 반',
      week: '금,토 요일',
      location: '강동구 실내 수영장',
      time: '11:00 ~ 12:00',
    },
    {
      id: '3',
      name: '생존 수영 반',
      week: '금,토 요일',
      location: '왕십리 스윔센터',
      time: '11:00 ~ 12:00',
    },
    {
      id: '4',
      name: '아침 5 반',
      week: '금,토 요일',
      location: '강동구 실내 수영장',
      time: '11:00 ~ 12:00',
    },
    {
      id: '5',
      name: '아티스틱 스윔 반',
      week: '금,토 요일',
      location: '강동구 실내 수영장',
      time: '11:00 ~ 12:00',
    },
    {
      id: '6',
      name: '생존 수영 반',
      week: '금,토 요일',
      location: '왕십리 스윔센터',
      time: '11:00 ~ 12:00',
    },
    {
      id: '7',
      name: '생존 수영 반',
      week: '금,토 요일',
      location: '왕십리 스윔센터',
      time: '11:00 ~ 12:00',
    },
  ];

  return (
    <>
      <Header title="회원 선택" />
      <div className={styled.container}>
        <p className={styled.title}>
          피드백을 남길 <br />
          수업을 선택해주세요
        </p>
        <div className={styled.search_class}>
          {classList.map((item) => (
            <button
              className={`${styled.item} ${selected === item.id ? styled.active : ''}`}
              onClick={() => setSelected(item.id)}>
              <div>
                <span className={styled.check}>
                  {selected === item.id ? (
                    <Check color={'#3689FF'} />
                  ) : (
                    <Check color={'#d7dbde'} />
                  )}
                </span>
                <p className={styled.name}>{item.name}</p>
                <p>
                  <span>
                    <Calendar_SM width="15" />
                  </span>
                  {item.week}
                </p>
                <p>
                  <span>
                    <Location width="15" />
                  </span>
                  {item.location}
                </p>
                <p>
                  <span>
                    <Clock width="15" />
                  </span>
                  {item.time}
                </p>
              </div>
            </button>
          ))}
        </div>
        <button className={styled.select_button} disabled={selected === null}>
          해당 수업 선택
        </button>
      </div>
    </>
  );
}
