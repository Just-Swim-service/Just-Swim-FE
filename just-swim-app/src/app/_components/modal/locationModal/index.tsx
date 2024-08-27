'use client';

import { ChangeEvent, Dispatch, MouseEvent, SetStateAction, useLayoutEffect, useState } from "react";
import Image from "next/image";

import { ConfirmButton, Portal } from "@components";
import { IconCheck, IconSearch, ImageArrowBack } from "@assets";
import { LOCATION_LIST } from "@data";
import { randomId } from "@utils";

import styled from './styles.module.scss';

const getLocationList = (word: string) => {
  if (!word) {
    return [...LOCATION_LIST];
  }

  const result = [];

  for (const location of LOCATION_LIST) {
    if (location.name.includes(word) || location.location.includes(word)) {
      result.push(location);
    }
  }

  return result;
}

function LocationListItem({
  location,
  selected,
  setSelected,
}: {
  location : {
    name: string,
    location: string,
  },
  selected: string,
  setSelected: Dispatch<SetStateAction<string>>,
}) {
  const onClickItem = () => {
    setSelected(location.name);
  }

  return (
    <div className={styled.list_item} onClick={onClickItem}>
      <div className={`${styled.check_box} ${selected === location.name && styled.selected}`}>
        <IconCheck />
      </div>
      <div className={styled.text_wrapper}>
        <p className={styled.name}>{location.name}</p>
        <p className={styled.location}>{location.location}</p>
      </div>
    </div>
  )
}

export function LocationModal({
  title = '수업 등록하기',
  location,
  selectLocation,
  hideModal,
  unshowModal,
}: {
  title?: string,
  location?: string,
  selectLocation: (location: string) => void,
  hideModal: (event: MouseEvent<HTMLElement>) => void,
  unshowModal: () => void,
}) {
  const [selected, setSelected] = useState('');
  const [input, setInput] = useState("");

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  }

  const onClickBack = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    unshowModal();
  }

  const onClickButton = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    selectLocation(selected);
    unshowModal();
  }

  const locationList = getLocationList(input);

  useLayoutEffect(() => {
    if (location) {
      setSelected(location);
    }
  }, [location]);
  
  return (
    <Portal>
      <div className={styled.container}>
        <div className={styled.header}>
          <div className={styled.title_wrapper}>
            <button onClick={onClickBack}>
              <Image src={ImageArrowBack} alt="뒤로가기" />
            </button>
            <p>{title}</p>
          </div>
        </div>
        <div>
          <div className={styled.search_wrapper}>
            <div className={styled.icon_wrapper}>
              <IconSearch width={22} height={22} />
            </div>
            <input
              className={styled.search_input}
              type="text"
              placeholder="수업 장소 검색"
              value={input}
              onChange={onChangeInput}
            />
          </div>
          <div className={styled.location_list}>
            {
              locationList.map(location => {
                return (
                  <LocationListItem
                    key={randomId()}
                    location={location}
                    selected={selected}
                    setSelected={setSelected}
                  />
                )
              })
            }
          </div>
          <div className={styled.button_wrapper}>
            <ConfirmButton
              kind="confirm"
              text="선택하기"
              active={!!selected}
              onClick={onClickButton}
            />
          </div>
        </div>
      </div>
    </Portal>
  )
}