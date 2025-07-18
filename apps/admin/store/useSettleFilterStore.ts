import { create } from 'zustand';

type FilterValue = 'all' | 'before' | 'progress' | 'done';

interface SettleFilterStore {
	filter: FilterValue;
	setFilter: (value: FilterValue) => void;
}

export const useSettleFilterStore = create<SettleFilterStore>((set) => ({
	filter: 'all',
	setFilter: (value) => set({ filter: value }),
}));
