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
  members: {
    userId: string;
    name: string;
    profileImage: string | null;
  }[];
  instructor: {
    instructorName: string;
    instructorProfileImage: string | null;
  };
}

type State = {
  classList?: any[];
  userList?: Member[];
  checkedList: Member[];
  selectedList: Member[];
  processedData?: {
    userNameList: Member[];
    groupNameList: { lecture: string; members: Member[] }[];
  };
  isLoading: boolean;
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

const processUserData = (rawData: any[]) => {
  if (!rawData || rawData.length === 0) {
    return { userNameList: [], groupNameList: [] };
  }

  const userNameList = [...rawData].sort((a, b) =>
    a.memberNickname.localeCompare(b.memberNickname, 'ko'),
  );

  const groupMap = rawData.reduce((acc: any, member: any) => {
    const { lectureId, lectureTitle } = member;
    if (!acc[lectureId]) {
      acc[lectureId] = {
        lecture: lectureTitle,
        members: [],
      };
    }
    acc[lectureId].members.push(member);
    return acc;
  }, {});

  const groupNameList = Object.values(groupMap);

  return { userNameList, groupNameList };
};

// @ts-ignore
const initialState: State = {
  selectedList: [],
  checkedList: [],
  isLoading: false,
};

const searchUserStore = create<any>()(
  persist(
    (set, get) => ({
      userList: [],
      checkedList: [],
      selectedList: [],
      processedData: undefined,
      isLoading: false,
      resetMemberData: () => {
        set(initialState);
      },
      loadUserList: async () => {
        set({ isLoading: true });
        try {
          const userList = await getMemberList();
          const rawData = (userList as any)?.data?.data || [];

          const processedData = processUserData(rawData);

          set({
            userList: userList || [],
            processedData,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to load user list:', error);
          set({ isLoading: false });
        }
      },
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
      updateCheckList: (list: Member[]) =>
        set((state: any) => {
          return {
            checkedList: [...list],
          };
        }),
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
        userList: state.userList,
        processedData: state.processedData,
      }),
    },
  ),
);

const searchClassStore = create<any>()(
  persist(
    (set) => ({
      classList: [],
      checkedList: [],
      selectedList: [],
      resetClassData: () => {
        set(initialState);
      },
      loadUserList: async () => {
        const classList = await getClassList();
        const formattedUserList = classList?.data.data.map(
          (classGroup: ClassGroup) => {
            const lectureTime = classGroup.lectureTime
              ? classGroup.lectureTime.split('-')
              : [];

            return {
              ...classGroup,
              lectureTime,
            };
          },
        );

        set({ classList: formattedUserList || [] });
      },
      checkItemHandler: (e: ChangeEvent<HTMLInputElement>, lectureId: string) =>
        set((state: any) => {
          const isChecked = e.target.checked;

          const selectClass = state.classList.find(
            (member: ClassGroup) => member.lectureId === lectureId,
          );
          if (!selectClass) return state;
          return {
            checkedList: isChecked
              ? [...state.checkedList, selectClass]
              : state.checkedList.filter(
                  (member: ClassGroup) => member.lectureId !== lectureId,
                ),
          };
        }),
      setCheckAllHandler: () =>
        set((state: any) => {
          return {
            checkedList: [...state.classList],
          };
        }),
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
