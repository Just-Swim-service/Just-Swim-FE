'use client';

import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";

import { ConfirmButton, HistoryBackHeader } from "@components";
import { IconCheck, IconSearch } from "@assets";
import { LOCATION_LIST } from "@data";
import { randomId } from "@utils";
import { prevPathStore } from "@store";

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
  const onClickItme = () => {
    setSelected(location.name);
  }

  return (
    <div className={styled.list_item} onClick={onClickItme}>
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

export default function SearchLocation() {
  const router = useRouter();
  const { prevPath } = prevPathStore();

  const [selected, setSelected] = useState("");
  const [input, setInput] = useState("");

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  }

  const onClickButton = () => {
    // router.push({
    //   pathname: prevPath
    // })

    console.log(router);
    
  }

  const locationList = getLocationList(input);
  
  return (
    <div>
      <HistoryBackHeader title="수업 위치 변경" />
      <main>
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
      </main>
    </div>
  )
}