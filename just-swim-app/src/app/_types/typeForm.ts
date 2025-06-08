import { ChangeEvent } from 'react';
import { LectureProps } from './typeLecture';
import { FieldPath, UseFormSetValue } from 'react-hook-form';
import { FormType } from '@/_schema';

export interface TextInputProps {
  name: string;
  valid?: boolean;
  link?: boolean;
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

export interface FileInputProps<T extends Record<string, any> = FormType> {
  name: FieldPath<T>;
  length?: number;
  size?: number;
  setValue: UseFormSetValue<FormType>;
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

export interface SelectInputProps {
  name: string;
  lectures?: LectureProps;
  members?: any;
}
