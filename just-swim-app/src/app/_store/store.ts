import { create } from 'zustand';

// const useStore = create((set) => ({
//   bears: 0,
//   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
//   removeAllBears: () => set({ bears: 0 }),
//   updateBears: (newBears) => set({ bears: newBears }),
// }))

const useCostomerStore = create((set) => ({
  customerList: [
    {
      '아침 5반': [
        {
          id: 1,
          name: '김고독',
          profile: 'profile1',
          check: false,
          class: '아침 5반',
        },
        {
          id: 2,
          name: '김고독',
          profile: 'no_profile',
          check: false,
          class: '아침 5반',
        },
        {
          id: 3,
          name: '김고독',
          profile: 'profile1',
          check: false,
          class: '아침 5반',
        },
        {
          id: 4,
          name: '김고독',
          profile: 'profile1',
          check: false,
          class: '아침 5반',
        },
        {
          id: 5,
          name: '김고독',
          profile: 'no_profile',
          check: false,
          class: '아침 5반',
        },
      ],
    },
    {
      '아침 6반': [
        {
          id: 11,
          name: '김해피',
          profile: 'profile1',
          check: false,
          class: '아침 5반',
        },
        {
          id: 12,
          name: '김감자',
          profile: 'no_profile',
          check: false,
          class: '아침 5반',
        },
        {
          id: 13,
          name: '김감자',
          profile: 'profile1',
          check: false,
          class: '아침 5반',
        },
        {
          id: 14,
          name: '김감자',
          profile: 'profile1',
          check: false,
          class: '아침 5반',
        },
        {
          id: 15,
          name: '김감자',
          profile: 'no_profile',
          check: false,
          class: '아침 5반',
        },
      ],
    },
  ],
  removeItem: (id:any) =>
    set((state:any) => {
      state.customerList.filter((item:any) => item.id !== id);
    }),
  checkItem: (id:any) =>
    set((state:any) => ({
      customerList: state.customerList.map((group:any) => {
        const groupName = Object.keys(group)[0];
        const updatedCustomers = group[groupName].map((customer:any) =>
          customer.id === id
            ? { ...customer, check: !customer.check }
            : customer,
        );
        return { [groupName]: updatedCustomers };
      }),
    })),
}));

export { useCostomerStore };
