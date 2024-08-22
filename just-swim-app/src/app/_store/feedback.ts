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
        link: '',
        content: '',
        file: '',
        fileURL: '',
        target: '',
      },
      setFeedbackHandler: (form, targetType: string) =>
        set((state: any) => {
          console.log(form);
          return {
            formDataState: {
              date: form.date,
              link: form.link,
              content: form.content,
              file: form.file,
              fileURL: form.fileURL,
              target: form.target,
              type: targetType,
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
