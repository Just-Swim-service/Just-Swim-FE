import { ChangeEvent } from "react";

export interface TextInputProps {
  name: string;
  valid?: boolean;
}

export interface ColorInputProps {
  name: string;
  defaultValue?: string;
}

export interface DateInputProps {
  name: string;
  valid?: boolean;
  defaultValue?: string;
  renderIcon?: Function;
  suffix?: string;
}

export interface DayInputProps {
  name: string;
  valid?: boolean;
  defaultValue?: string;
}

export interface FileInputProps {
  name: string;
  length?: number;
  size?: number;
}

export interface LocationInputPros {
  name: string;
  valid?: boolean;
}

export interface TimeInputProps {
  name: string;
  valid?: boolean;
  defaultValue?: string;
  defaultTimeValue?: string;
}

export interface FormButtonProps {
  text: string;
  loading?: string;
  active?: boolean;
}

export interface TextAreaProps {
  name: string;
  height?: number;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface SelectPersonInputProps {
  name: string;
}