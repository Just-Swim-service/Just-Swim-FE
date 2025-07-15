'use client';

import { useEffect } from 'react';

import styled from './searchClass.module.scss';
import Location from '@assets/location.svg';
import Calendar_SM from '@assets/calendar_sm.svg';
import Clock from '@assets/clock.svg';
import Check from '@assets/check.svg';

import { Header } from '@components';
import { searchClassStore } from '@store';
import { useRouter } from 'next/navigation';

export default function SearchClass() {
  const router = useRouter();
  const {
    classList,
    loadUserList,
    checkedList,
    checkItemHandler,
    setSelectedListHandler,
    // @ts-ignore
    setCheckAllHandler,
  } = searchClassStore();

  useEffect(() => {
    loadUserList();
  }, [loadUserList]);

  const checkLength = () => {
    const checkedCount = checkedList.length;
    return checkedCount;
  };

  return (
    <>
      <Header title="수업 선택" />
      <div className={styled.container}>
        <p className={styled.title}>
          전체 피드백을 남길 <br />
          수업을 선택해주세요
        </p>
        <div className={styled.search_class}>
          {classList.map((group: any, index: number) => (
            <li
              key={index}
              className={`${styled.item} ${
                checkedList.some(
                  (checkedItem: any) =>
                    checkedItem.lectureId === group.lectureId,
                )
                  ? styled.active
                  : ''
              }`}>
              <input
                className={styled.check}
                id={group.lectureId}
                type="checkbox"
                onChange={(e) => checkItemHandler(e, group.lectureId)}
                checked={checkedList.some(
                  (checkedItem: any) =>
                    checkedItem.lectureId === group.lectureId,
                )}
              />
              <label htmlFor={group.lectureId}>
                <Check className={styled.check_icon} />
              </label>
              <div>
                <p className={styled.name}>{group.lectureTitle}</p>
                <p>
                  <span>
                    <Calendar_SM width="15" />
                  </span>
                  {/* @ts-ignore */}
                  {group.lectureDays}
                </p>
                <p>
                  <span>
                    <Clock width="15" />
                  </span>
                  {/* @ts-ignore */}
                  {`${group.lectureTime[0]} ~ ${group.lectureTime[0]}`}
                </p>
                <p>
                  <span>
                    <Location width="15" />
                  </span>
                  {/* @ts-ignore */}
                  {group.lectureLocation}
                </p>
              </div>
            </li>
          ))}
        </div>
        <div className={styled.btn}>
          <button
            type="button"
            className={`${styled.complete_btn} ${checkLength() == 0 ? styled.disabled : ''}`}
            onClick={() => {
              setSelectedListHandler();
              router.push('/feedback/create/class');
            }}>
            선택 완료
          </button>
          <button
            type="button"
            className={styled.select_all_btn}
            onClick={setCheckAllHandler}>
            전체 선택
          </button>
        </div>
      </div>
    </>
  );
}
