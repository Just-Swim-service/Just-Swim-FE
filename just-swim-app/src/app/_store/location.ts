import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  location: string,
}

type Action = {
  setLocation: (path: string) => void, 
}

export const locationStore = create<State & Action>()(
  persist(
    (set) => ({
      location: "",
      setLocation: (location: string) => 
        set(() => {
          return {
            location: location,
          }
        })
    }),
    {
      name: 'location_store',
      partialize: (state: any) => ({
        location: state.location,
      })
    }
  )
)