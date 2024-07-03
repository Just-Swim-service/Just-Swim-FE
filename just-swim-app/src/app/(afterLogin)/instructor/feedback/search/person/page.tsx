'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import Image from 'next/image';
import iconArrowDown from '@assets/icon_arrow_down.png';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { HistoryBackHeader } from '@components';
import styled from './searchPerson.module.scss';
import { randomId } from '@utils';
import { searchUserStore } from '@store';
import { useRouter } from 'next/navigation';
import { IconSearch } from '@assets';

export default function SearchPerson() {
  const {
    userList,
    checkedList,
    selectedList,
    checkItemHandler,
    setSelectedListHandler,
    loadUserList,
  } = searchUserStore();

  const router = useRouter();
  const [value, setValue] = useState('one');
  const [stateObj, setStateObj] = useState<Object>({});

  useEffect(() => {
    loadUserList();
    console.log(userList);
  }, [loadUserList]);

  useEffect(() => {
    if (userList.length > 0) {
      setStateObj(consvertUserListToLectureIdObj());
    }
    console.log('stateObj', stateObj);
  }, [userList]);

  // userList를 lecturId에 따라서 리스트를 그려주기 위해 lecturId가 key인 object로 변경
  const consvertUserListToLectureIdObj = () => {
    const map = new Map();

    userList.forEach((user) => {
      if (map.has(user.lectureTitle)) {
        map.get(user.lectureTitle).push(user);
      } else {
        map.set(user.lectureTitle, [user]);
      }
    });

    const obj = Object.fromEntries(map);

    return obj;
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const checkLength = () => {
    const checkedCount = checkedList.length;
    return checkedCount;
  };

  return (
    <div className={styled.wrapper}>
      <HistoryBackHeader title="수강생 선택" />

      <div className={styled.pad}>
        <div className={styled.title}>
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

        <div className={styled.inner}>
          <div className={styled.search}>
            <input type="text" placeholder="수강생 이름으로 검색" />
            <button>
              <IconSearch />
            </button>
          </div>

          <div className={`${styled.row} ${styled.title}`}>
            <div>수업명</div>
            <button>
              <div>오름차순</div>
              <Image src={iconArrowDown} alt="펼치기" />
            </button>
          </div>
        </div>
      </div>

      <div className={styled.divider}></div>

      <div className={styled.pad}>
        {stateObj && Object.entries(stateObj).map(([group, members]) => (
          <div key={randomId()} className={styled.group}>
            <div className={styled.group_name}>{group}</div>
            {members.map((user: {
              userId: string,
              profileImage: string,
              memberNickname: string,
            }) => (
              <li key={user.userId} className={styled.customer}>
                <input
                  type="checkbox"
                  id={user.userId}
                  onChange={(e) => checkItemHandler(e, user.userId)}
                  checked={checkedList.some(
                    (item) => item.userId === user.userId,
                  )}
                />
                <label className={styled.row} htmlFor={`checkbox ${user}`}>
                  <div
                    className={styled.profile_img}
                    style={{
                      backgroundImage: `url(${user.profileImage})`,
                    }}
                  />
                  <div>{user.memberNickname}</div>
                </label>
                <div className={styled.customer_class_name}>{group}</div>
              </li>
            ))}
          </div>
        ))}
        {/* {userList?.map((member, index) => {
          return (
            <div key={randomId()} className={styled.group}>
              <div className={styled.group_name}>아침 5반</div>
              <li key={member.userId} className={styled.customer}>
                <input
                  type="checkbox"
                  id={member.userId}
                  onChange={(e) => checkItemHandler(e, member.userId)}
                  checked={checkedList.some(
                    (item) => item.userId === member.userId,
                  )}
                />
                <label className={styled.row} htmlFor={`checkbox ${member}`}>
                  <div
                    className={styled.profile_img}
                    style={{
                      backgroundImage: `url(${member.profileImage})`,
                    }}
                  />
                  <div>{member.memberNickname}</div>
                </label>
                <div className={styled.customer_class_name}>아침 5반</div>
              </li>
            </div>
          );
        })} */}
      </div>

      <div className={styled.main_btn}>
        <button
          type="button"
          onClick={() => {
            setSelectedListHandler();
            router.push('/instructor/feedback/write/person');
          }}
          className={` ${checkLength() == 0 ? styled.disabled : ''}`}>
          {checkLength()}명 선택하기
        </button>
      </div>
    </div>
  );
}
