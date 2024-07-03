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
  removeItemHandler: (userId: Prams['userId']) => void;
  loadUserList: () => Promise<void>;
};

const URL = `${process.env.NEXT_PUBLIC_DB_HOST}/member`;
console.log(URL);

async function getMemberList() {
  const response = await fetch(URL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
    },
  });
  const json = await response.json();
  console.log(json);
  return json;
}

const searchUserStore = create<State & Action>()(
  persist(
    (set) => ({
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
      }),
    },
  ),
);

export { searchUserStore };
