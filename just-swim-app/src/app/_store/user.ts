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
  loadProfileInfo: () => Promise<void>;
  setProfileInfo: (profile: any) => void;
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
      loadProfileInfo: async () => {
        const currentProfile = get().profileInfo;
        if (currentProfile) return;

        set({ isLoading: true });
        try {
          const response = await getMyProfile();
          const profileData = response.data.data;
          set({
            profileInfo: profileData,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to load profile info:', error);
          set({ isLoading: false });
        }
      },
      setProfileInfo: (profile: any) => {
        set({ profileInfo: profile });
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
