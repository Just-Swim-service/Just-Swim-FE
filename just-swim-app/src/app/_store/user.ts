import { create } from 'zustand';
import { Provider, UserEntity, UserType } from '@types';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getMyProfile } from '@apis';

export type User = {
  token: string | boolean;
  profile: Partial<UserEntity>;
};

type UserStoreType = {
  user: Record<string, Partial<Omit<User, 'token'>>>;
  profileInfo: {
    email: string;
    name: string;
    userType: UserType;
    profileImage: string;
    birth?: string;
    phoneNumber?: string;
  } | null;
  isLoading: boolean;
  getToken: () => string;
  getUser: () => Record<string, Partial<Omit<User, 'token'>>>;
  getProvider: (token: Provider) => string;
  getUserEmail: (token: string) => string;
  getUserName: (token: string) => string;
  getUserType: (token: string | boolean) => UserType;
  getUserImage: (token: string) => string;
  setAddUserToken: (token: string) => void;
  setAddUserProfile: ({ token, profile }: User) => void;
  setResetUser: () => void;
  loadProfileInfo: (forceRefresh?: boolean) => Promise<void>;
  setProfileInfo: (profile: any) => void;
  invalidateProfile: () => void;
  refreshProfile: () => Promise<void>;
  updateProfileAfterEdit: (updatedData: any) => void;
};

export const useUserStore = create(
  persist<UserStoreType>(
    (set, get) => ({
      user: {},
      profileInfo: null,
      isLoading: false,
      getToken: () => {
        return Object.keys(get().user)[0];
      },
      getUser: () => get().user,
      getProvider: (token: Provider) => {
        return get().user[token]?.profile?.provider || '';
      },
      getUserEmail: (token: string) => {
        return get().user[token]?.profile?.email || '';
      },
      getUserName: (token: string) => {
        return get().user[token]?.profile?.name || '';
      },
      getUserType: (token: string | boolean) => {
        if (typeof token !== 'string') return '' as UserType;
        return (get().user[token]?.profile?.userType || '') as UserType;
      },
      getUserImage: (token: string) => {
        return get().user[token]?.profile?.profileImage || '';
      },
      setAddUserToken: (token: string) => {
        set((state: UserStoreType) => {
          const overWriteUsers = {
            ...state.user,
            [token]: { ...state.user[token], profile: {} },
          };

          return {
            ...state,
            user: overWriteUsers,
          };
        });
      },
      setAddUserProfile: ({ token, profile }: User) => {
        set((state: UserStoreType) => {
          if (typeof token !== 'string') return state;
          const prevUser = state.user[token] || { profile: {} };
          const overWriteUser = {
            ...state.user,
            [token]: {
              ...prevUser,
              profile: { ...prevUser.profile, ...profile },
            },
          };

          return {
            ...state,
            user: overWriteUser,
          };
        });
      },
      setResetUser: () => {
        set(() => ({
          user: {},
          profileInfo: null,
        }));
      },
      loadProfileInfo: async (forceRefresh = false) => {
        const currentProfile = get().profileInfo;
        if (currentProfile && !forceRefresh) {
          console.log(
            '🔔 [UserStore] 프로필 캐시 사용:',
            currentProfile.profileImage,
          );
          return;
        }

        console.log('🔔 [UserStore] 프로필 새로고침 시작');
        set({ isLoading: true });
        try {
          const response = await getMyProfile();
          const profileData = response.data.data;
          console.log('🔔 [UserStore] 새로운 프로필 데이터:', profileData);
          set({
            profileInfo: profileData,
            isLoading: false,
          });
        } catch (error) {
          console.error('🔔 [UserStore] 프로필 로드 실패:', error);
          set({ isLoading: false });
        }
      },
      setProfileInfo: (profile: any) => {
        set({ profileInfo: profile });
      },
      invalidateProfile: () => {
        set({ profileInfo: null });
      },
      refreshProfile: async () => {
        console.log('🔔 [UserStore] 프로필 강제 새로고침');
        set({ profileInfo: null });
        await get().loadProfileInfo(true);
      },
      updateProfileAfterEdit: (updatedData: any) => {
        console.log('🔔 [UserStore] 프로필 수정 후 업데이트:', updatedData);
        const currentProfile = get().profileInfo;
        if (currentProfile) {
          const updatedProfile = {
            ...currentProfile,
            ...updatedData,
          };
          set({ profileInfo: updatedProfile });
          console.log('🔔 [UserStore] 프로필 업데이트 완료:', updatedProfile);
        }
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
