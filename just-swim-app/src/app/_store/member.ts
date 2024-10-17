import { ClassContentCard } from '@components';
import { getClassList, getMemberList } from '@/_apis/member';
import { ChangeEvent } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Member {
  memberId: string;
  userId: string;
  memberNickname: string;
  profileImage: string;
  lectureId: string;
  lectureTitle: string;
}

interface ClassGroup {
  lectureColor: string;
  lectureContent: string;
  lectureDays: string;
  lectureEndDate: string;
  lectureId: string;
  lectureLocatio: string;
  lectureQRCode: string;
  lectureTime: string;
  lectureTitle: string;
  memberProfileImage: string;
  memberUserId: string;
}

type State = {
  userList: Member[] | [];
  checkedList: Member[];
  selectedList: Member[];
};

type Prams = {
  userId: string;
  checkedList: Member[];
};

type Action = {
  checkItemHandler: (
    e: ChangeEvent<HTMLInputElement>,
    userId: Prams['userId'],
  ) => void;
  setSelectedListHandler: () => void;
  updateSelectedList: (list: Member[] | []) => void;
  removeItemHandler: (userId: Prams['userId']) => void;
  loadUserList: () => Promise<void>;
};

// @ts-ignore
const initialState: State = {
  selectedList: [],
  checkedList: [],
};

const searchUserStore = create<State & Action>()(
  persist(
    (set) => ({
      reset: () => {
        set(initialState);
      },
      userList: [],
      loadUserList: async () => {
        const userList = await getMemberList();
        set({ userList: userList || [] });
      },
      checkedList: [],
      selectedList: [],
      checkItemHandler: (e: ChangeEvent<HTMLInputElement>, userId: string) =>
        set((state: any) => {
          const isChecked = e.target.checked;

          const selectMember = state.userList.find(
            (member: Member) => member.userId === userId,
          );
          if (!selectMember) return state;
          return {
            checkedList: isChecked
              ? [...state.checkedList, selectMember]
              : state.checkedList.filter(
                  (member: Member) => member.userId !== userId,
                ),
          };
        }),
      // 추가한 부분
      updateSelectedList: (list: Member[]) =>
        set((state: any) => {
          return {
            selectedList: [...list],
          };
        }),
      setSelectedListHandler: () =>
        set((state: any) => {
          return {
            selectedList: state.checkedList,
          };
        }),
      removeItemHandler: (userId: string) =>
        set((state: any) => ({
          selectedList: state.selectedList.filter(
            (member: Member) => member.userId !== userId,
          ),
          checkedList: state.checkedList.filter(
            (member: Member) => member.userId !== userId,
          ),
        })),
    }),
    {
      name: 'checked_list',
      partialize: (state: any) => ({
        selectedList: state.selectedList,
        checkedList: state.checkedList,
      }),
    },
  ),
);

const searchClassStore = create<State & Action>()(
  persist(
    (set) => ({
      reset: () => {
        set(initialState);
      },
      userList: [],
      loadUserList: async () => {
        const userList = await getClassList();
        set({ userList: userList || [] });
      },
      checkedList: [],
      selectedList: [],
      checkItemHandler: (e: ChangeEvent<HTMLInputElement>, lectureId: string) =>
        set((state: any) => {
          const isChecked = e.target.checked;

          const selectMember = state.userList.find(
            (member: ClassGroup) => member.lectureId === lectureId,
          );
          if (!selectMember) return state;
          return {
            checkedList: isChecked
              ? [...state.checkedList, selectMember]
              : state.checkedList.filter(
                  (member: ClassGroup) => member.lectureId !== lectureId,
                ),
          };
        }),
      setCheckAllHandler: () =>
        set((state: any) => {
          return {
            checkedList: [...state.userList],
          };
        }),
      // 추가한 부분
      updateCheckList: (list: ClassGroup[]) =>
        set((state: any) => {
          return {
            checkedList: [...list],
          };
        }),
      updateSelectedList: (list: ClassGroup[]) =>
        set((state: any) => {
          return {
            selectedList: [...list],
          };
        }),
      setSelectedListHandler: () =>
        set((state: any) => {
          return {
            selectedList: state.checkedList,
          };
        }),

      removeItemHandler: (lectureId: string) =>
        set((state: any) => ({
          selectedList: state.selectedList.filter(
            (member: ClassGroup) => member.lectureId !== lectureId,
          ),
          checkedList: state.checkedList.filter(
            (member: ClassGroup) => member.lectureId !== lectureId,
          ),
        })),
    }),
    {
      name: 'checked_class_list',
      partialize: (state: any) => ({
        selectedList: state.selectedList,
        checkedList: state.checkedList,
      }),
    },
  ),
);
export { searchUserStore, searchClassStore };
