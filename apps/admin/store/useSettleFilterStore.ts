import { create } from 'zustand';

type FilterValue = 'ALL' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';

interface SettleFilterStore {
	filter: FilterValue;
	setFilter: (value: FilterValue) => void;
}

export const useSettleFilterStore = create<SettleFilterStore>((set) => ({
	filter: 'ALL',
	setFilter: (value) => set({ filter: value }),
}));
