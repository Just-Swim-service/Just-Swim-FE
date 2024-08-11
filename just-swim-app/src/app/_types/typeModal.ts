import { MouseEvent } from "react";

import { DayProps } from "@types";

export interface ColorModalProps {
  initialColor: string,
  hideModal: (event: MouseEvent<HTMLElement>) => void,
  setColor: (color: string) => void,
}

export interface DateModalProps {
  initialDate: string,
  hideModal: (event: MouseEvent<HTMLElement>) => void,
  setDate: (color: string) => void,
}

export interface DayModalProps {
  initialDays: DayProps,
  hideModal: (event: MouseEvent<HTMLElement>) => void,
  setDays: (days: DayProps) => void,
}

export interface TimeModalProps {
  timeValue: string,
  hideModal: (event: MouseEvent<HTMLElement>) => void,
  setTimeValue: (time: string) => void,
}

export interface MonthModalProps {
  yearValue: number,
  monthValue: number,
  updateValue: ({ year, month }: { year: number, month: number }) => void,
  hideModal: (event: MouseEvent<HTMLElement>) => void,
}