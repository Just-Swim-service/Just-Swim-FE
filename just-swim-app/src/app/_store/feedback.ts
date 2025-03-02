import { ChangeEvent } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FeedbackFormData {
  date: string;
  files: File[] | null;
  targets: string[];
  link: string | null;
  content: string;
}

// TODO: 타입 정의
interface FeedbackStoreState {
  formData: FeedbackFormData;
  setFeedbackFormData: (formData: FeedbackFormData) => void;
  resetFeedbackFormData: () => void;
  getFeedbackFormData: () => FeedbackFormData;
}

const initialFormData: FeedbackFormData = {
  date: '',
  files: null,
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
              date: form.date,
              link: form.link,
              content: form.content,
              files: form.files,
              targets: form.targets,
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
