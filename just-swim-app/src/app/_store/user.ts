import { create } from 'zustand';
import { Provider, UserEntity, UserType } from '@types';
import { createJSONStorage, persist } from 'zustand/middleware';

export type User = {
  token: string;
  profile: Partial<UserEntity>;
};

type UserStoreType = {
  user: Record<string, Partial<Omit<User, 'token'>>>;
  getToken: () => string;
  getUser: () => Record<string, Partial<Omit<User, 'token'>>>;
  getProvider: (token: Provider) => string;
  getUserEmail: (token: string) => string;
  getUserName: (token: string) => string;
  getUserType: (token: string) => UserType;
  getUserImage: (token: string) => string;
  setAddUserToken: (token: string) => void;
  setAddUserProfile: ({ token, profile }: User) => void;
  setResetUser: () => void;
};

export const useUserStore = create(
  persist<UserStoreType>(
    (set, get) => ({
      user: {},
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
      getUserType: (token: string) => {
        return (get().user[token]?.profile?.userType || '') as UserType;
        // return 'customer';
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
        }));
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
