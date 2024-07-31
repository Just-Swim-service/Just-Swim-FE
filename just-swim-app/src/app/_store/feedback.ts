import { getMemberList } from '@/_apis/member';
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

interface FeedbackStoreState {
  formData: FeedbackFormData;
  setFeedbackFormData: (formData: FeedbackFormData) => void;
  resetFeedbackFormData: () => void;
}

const feedbackStore = create<any>()(
  persist(
    (set) => ({
      formDataState: {
        date: '',
        files: '',
        link: '',
        content: '',
      },
      setFeedbackHandler: (form) =>
        set((state: any) => {
          // console.log(form);
          return {
            formDataState: {
              date: form.date,
              link: form.link,
              content: form.content,
              file: form.file,
            },
          };
        }),
    }),
    {
      name: 'formDataState',
    },
  ),
);

export { feedbackStore };
