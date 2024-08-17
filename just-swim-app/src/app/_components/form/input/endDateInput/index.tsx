'use client';

import { ForwardedRef, forwardRef, InputHTMLAttributes, useCallback, useState } from "react";

import { DateInput, SlideSwitch } from "@components";
import { DateInputProps } from "@types";
import { randomId } from "@utils";

import styled from './styles.module.scss';

function _EndDateInput({
  ...props
}: DateInputProps & InputHTMLAttributes<HTMLInputElement>, 
ref: ForwardedRef<HTMLInputElement>) {
  const [useEndDate, setUseEndDate] = useState<boolean>(false);

  const onChangeSwitch = useCallback(() => {
    setUseEndDate(s => !s);
  }, []);

  return (
    <div>
      <div className={styled.switch_wrapper}>
        <p>종료일 설정</p>
        <SlideSwitch defaultState="off" onChange={onChangeSwitch} />
      </div>
      <DateInput key={randomId()} {...props} ref={ref} use={useEndDate}/>
    </div>
  )
}

export const EndDateInput = forwardRef(_EndDateInput);