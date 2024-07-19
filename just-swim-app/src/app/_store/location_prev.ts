import { create } from 'zustand';

const useLocationStore = create((set) => ({
  locationList: [],
  increasePopulation: () => set((state: any) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears: any) => set({ bears: newBears }),
}));
