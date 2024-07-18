import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  prevPath: string,
}

type Action = {
  setPrevPath: (path: string) => void, 
}

export const prevPathStore = create<State & Action>()(
  persist(
    (set) => ({
      prevPath: "",
      setPrevPath: (path: string) => 
        set(() => {
          return {
            prevPath: path,
          }
        })
    }),
    {
      name: 'prev_path',
      partialize: (state: any) => ({
        prevPath: state.prevPath,
      })
    }
  )
)