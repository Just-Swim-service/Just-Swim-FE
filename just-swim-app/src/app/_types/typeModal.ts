import { MouseEvent } from 'react';

import { DayProps, Members } from '@types';

export interface ModalBodyProps {
  children?: React.ReactNode;
  hideModal: (event: MouseEvent<HTMLElement>) => void;
}

export interface ConfirmModalProps extends ModalBodyProps {
  confirmCallback: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface LightConfirmModalProps extends ConfirmModalProps {
  title?: string;
  confirmText?: string;
  showCancel?: boolean;
}

export interface ColorModalProps extends ModalBodyProps {
  initialColor: string;
  setColor: (color: string) => void;
}

export interface DateModalProps extends ModalBodyProps {
  initialDate: string;
  setDate: (color: string) => void;
}

export interface DayModalProps {
  initialDays: DayProps;
  hideModal: (event: MouseEvent<HTMLElement>) => void;
  setDays: (days: DayProps) => void;
}

export interface TimeModalProps extends ModalBodyProps {
  timeValue: string;
  setTimeValue: (time: string) => void;
}

export interface MonthModalProps extends ModalBodyProps {
  yearValue: number;
  monthValue: number;
  updateValue: ({ year, month }: { year: number; month: number }) => void;
  unshowModal: () => void;
}

export interface FeedbackTargetListModalProps extends ModalBodyProps {
  feedbackTargetList: Members[];
}

export interface ImageFocusModalProps {
  imageUrl: string;
  onClose: () => void;
  images: string[];
  currentIndex: number;
}
