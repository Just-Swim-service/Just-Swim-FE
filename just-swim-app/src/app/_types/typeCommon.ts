import { Dispatch, MouseEvent, SetStateAction } from 'react';

export interface ConfirmButtonProps {
  text: string;
  kind: 'confirm' | 'confirm-sub' | 'cancel' | 'cancel-sub' | 'normal';
  border?: boolean;
  loading?: string;
  active?: boolean;
}

export interface CalendarProps {
  selectedDate?: string;
  changeSelectedDate?: (date: string) => void;
}

export interface CalendarItemProps {
  year?: number;
  month?: number;
  date: number;
  isDisabled: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export interface PreviewItem {
  previewURL: string;
  fileType: 'image' | 'video';
  duration?: number;
  filePath?: string;
}

export interface ImageCarouselProps {
  images: PreviewItem[];
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
  useDeleteButton?: boolean;
  deleteImage?: (index: number) => void;
  hideModal: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface URLImageProps {
  imageURL: string;
  alt: string;
  priority?: boolean;
  [key: string]: any;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}
