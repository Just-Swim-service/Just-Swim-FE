'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Header from '@_component/Header';
import searchIcon from '/public/assets/icon_search.png';
import arrowRightIcon from '/public/assets/icon_arrow_right.png';
import iconArrowDown from '@assets/icon_arrow_down.svg';
import Link from 'next/link';
import './searchPerson.scss';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export default function SearchPerson() {
  const customerList = [
    { name: '김고독', profile: 'profile1' },
    { name: '김고독', profile: 'no_profile' },
    { name: '김고독', profile: 'profile1' },
    { name: '김고독', profile: 'profile1' },
    { name: '김고독', profile: 'no_profile' },
  ];

  const customerList2 = [
    {
      '아침 5반': [
        { name: '김고독', profile: 'profile1' },
        { name: '김고독', profile: 'no_profile' },
        { name: '김고독', profile: 'profile1' },
        { name: '김고독', profile: 'profile1' },
        { name: '김고독', profile: 'no_profile' },
      ],
    },
    {
      '아침 6반': [
        { name: '김고독', profile: 'profile1' },
        { name: '김고독', profile: 'no_profile' },
        { name: '김고독', profile: 'profile1' },
        { name: '김고독', profile: 'profile1' },
        { name: '김고독', profile: 'no_profile' },
      ],
    },
  ];

  const [value, setValue] = useState('one');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [checkedState, setCheckedState] = useState({});
  const handleChecked = (event: React.ChangeEvent) => {
    const { id, checked } = event.target;
    // console.log(event.target);
    setCheckedState({
      ...checkedState,
      [id]: checked,
    });
  };

  useEffect(() => {
    console.log(Object.keys(checkedState).length);
  }, [checkedState]);

  return (
    <div className="search_person">
      <Header title="회원 선택" />

      <div className="pad">
        <div className="title">
          피드백을 남길 <br />
          수강생을 선택해주세요
        </div>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '12px',
          }}>
          <Tabs
            sx={{ width: '100%', display: 'flex' }}
            value={value}
            onChange={handleChange}
            aria-label="wrapped label tabs example">
            <Tab sx={{ flex: 1 }} value="one" label="수업별로 보기" />
            <Tab sx={{ flex: 1 }} value="two" label="이름순으로 보기" />
          </Tabs>
        </Box>

        <div className="inner">
          <div className="search">
            <input type="text" placeholder="수강생 이름으로 검색" />
            <button>
              <Image src={searchIcon} alt="검색" />
            </button>
          </div>

          <div className="row title">
            <div>수업명</div>
            <button>
              <div>오름차순</div>
              <Image src={iconArrowDown} alt="펼치기" />
            </button>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="pad">
        {customerList2.map((group, index) => (
          <div key={index} className="group">
            <div className="group_name">{Object.keys(group)[0]}</div>
            {group[Object.keys(group)[0]].map((customer, idx) => (
              <li key={idx} className="customer">
                <input
                  type="checkbox"
                  id={`checkbox ${idx}`}
                  onChange={(event) => handleChecked(event, idx)}
                />
                <label className="row" htmlFor={`checkbox ${idx}`}>
                  <Image
                    src={`/assets/${customer.profile}.png`}
                    alt="profile"
                    width={34}
                    height={34}
                  />
                  <div>{customer.name}</div>
                </label>
                <div className="customer_class_name">아침 5반</div>
              </li>
            ))}
          </div>
        ))}

        {/* {customerList.map((el, index) => (
            <li key={index} className="customer">
              <input type="checkbox" id={`checkbox ${index}`} />
              <label className="row" htmlFor={`checkbox ${index}`}>
                <Image
                  src={`/assets/${el.profile}.png`}
                  alt="profile"
                  width={34}
                  height={34}
                />
                <div>{el.name}</div>
              </label>
              <div className="customer_class_name">아침 5반</div>
            </li>
          ))} */}

        <div className="main_btn">
          <button type="button">{Object.keys(checkedState).length}명 선택하기</button>
        </div>
      </div>
    </div>
  );
}
