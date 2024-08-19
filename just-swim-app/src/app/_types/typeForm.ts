import { ChangeEvent } from "react";

export interface TextInputProps {
  name: string;
  valid?: boolean;
  errorMessage: string | undefined;
}

export interface ColorInputProps {
  name: string;
  defaultValue?: string;
}

export interface DateInputProps {
  name: string;
  valid?: boolean;
  defaultValue?: string;
  use?: boolean;
  renderIcon?: Function;
  suffix?: string;
}

export interface DayInputProps {
  name: string;
  valid?: boolean;
  errorMessage: string | undefined;
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
  errorMessage: string | undefined;
  defalutValue?: string;
}

export interface TimeInputProps {
  name: string;
  valid?: boolean;
  errorMessage: string | undefined;
  defaultValue?: string;
  defaultTimeValue?: string;
}

export interface LinkInputProps {
  name: string;
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