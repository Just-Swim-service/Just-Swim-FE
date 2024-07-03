import { ChangeEvent } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Member {
  memberId: string;
  userId: string;
  memberNickname: string;
  profileImage: string;
}

type State = {
  userList: Member[];
  checkedList: Member[];
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
  removeItemHandler: (userId: Prams['userId']) => void;
};

const searchUserStore = create(
  persist<State & Action>(
    (set) => ({
      userList: [
        {
          memberId: '1',
          userId: '1',
          memberNickname: '홍길동',
          profileImage:
            'http://k.kakaocdn.net/dn/d3UHmi/btsH8xClKxG/jGQI0gBeKrlOkneK7KYIbK/img_640x640.jpg',
        },
        {
          memberId: '2',
          userId: '10',
          memberNickname: '홍길순',
          profileImage:
            'http://k.kakaocdn.net/dn/d3UHmi/btsH8xClKxG/jGQI0gBeKrlOkneK7KYIbK/img_640x640.jpg',
        },
      ],
      checkedList: [],
      checkItemHandler: (e: ChangeEvent<HTMLInputElement>, userId: string) =>
        set((state: any) => {
          const isChecked = e.target.checked;
          console.log(isChecked);
          console.log(state.checkedList);

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
      removeItemHandler: (userId: string) =>
        set((state: any) => ({
          checkedList: state.checkedList.filter(
            (member: Member) => member.userId !== userId,
          ),
        })),

      setCheckedList: (state: any) => set({ checkedList: state.checkedList }),
    }),
    {
      name: 'checked_list',
      partialize: (state: any) => ({ checkedList: state.checkedList }),
    },
  ),
);

export { searchUserStore };
