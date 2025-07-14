import { StoredFileInfo } from '@types';
import { ChangeEvent } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FeedbackFormData {
  date: string;
  files: StoredFileInfo[];
  targets: string[];
  link: string | null;
  content: string;
}

// TODO: 타입 정의
interface FeedbackStoreState {
  formDataState: FeedbackFormData & { type?: string };
  setFeedbackFormData: (form: FeedbackFormData, type?: string) => void;
  resetFeedbackFormData: () => void;
  getFeedbackFormData: () => FeedbackFormData & { type?: string };
}

const initialFormData: FeedbackFormData = {
  date: '',
  files: [],
  targets: [],
  link: null,
  content: '',
};

const feedbackStore = create<any>()(
  persist(
    (set, get) => ({
      // @ts-ignore
      setFeedbackFormData: (form, targetType) =>
        set(() => {
          return {
            formDataState: {
              ...form,
              files: form.files ?? [],
              type: targetType,
            },
          };
        }),
      resetFeedbackFormData: () =>
        set(() => {
          return {
            formDataState: initialFormData,
          };
        }),
      getFeedbackFormData: () => get().formDataState,
    }),
    {
      name: 'formDataState',
    },
  ),
);

export { feedbackStore };
