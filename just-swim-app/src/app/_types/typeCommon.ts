import { Dispatch, MouseEvent, SetStateAction } from "react";

export interface ConfirmButtonProps {
  text: string;
  kind: 'confirm' | 'confirm-sub' | 'cancel' | 'cancel-sub' | 'normal';
  border?: boolean;
  loading?: string;
  active?: boolean;
}

export interface CalendarProps {
  DateBlock?: JSX.ElementType,
  selectedDate?: string,
  changeSelectedDate?: (date: string) => void
}

export interface CalendarItemProps {
  date: number,
  isDisabled: boolean,
  isToday: boolean,
  isSelected: boolean,
}

export interface ImageCarouselProps {
  images: string[],
  index: number,
  setIndex: Dispatch<SetStateAction<number>>,
  useDeleteButton?: boolean,
  deleteImage?: (index: number) => void,
  hideModal: (event: MouseEvent<HTMLButtonElement>) => void,
}

export interface ModalBodyProps {
  children?: React.ReactNode,
  hideModal: (event: MouseEvent<HTMLElement>) => void,
}

export interface ConfirmModalProps {
  children?: React.ReactNode,
  hideModal: (event: MouseEvent<HTMLElement>) => void,
  confirmCallback: (event: MouseEvent<HTMLButtonElement>) => void,
}

export interface LightConfirmModalProps {
  title?: string,
  hideModal: (event: MouseEvent<HTMLElement>) => void,
  confirmCallback: (event: MouseEvent<HTMLButtonElement>) => void,
  children?: React.ReactNode,
}