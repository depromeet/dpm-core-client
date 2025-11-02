import { useCallback, useMemo, useState } from 'react';

export const useCheckboxSelection = <T extends { id: number }>(items: T[]) => {
	const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

	const toggleItem = useCallback((id: number) => {
		setSelectedIds((prev) => {
			const newSet = new Set(prev);

			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});
	}, []);

	const toggleAll = useCallback(() => {
		if (selectedIds.size === items.length) {
			setSelectedIds(new Set());
		} else {
			setSelectedIds(new Set(items.map((item) => item.id)));
		}
	}, [items, selectedIds.size]);

	const clearSelection = useCallback(() => {
		setSelectedIds(new Set());
	}, []);

	const isAllSelected = useMemo(() => {
		return items.length > 0 && selectedIds.size === items.length;
	}, [items.length, selectedIds.size]);

	return {
		selectedIds,
		toggleItem,
		toggleAll,
		isAllSelected,
		clearSelection,
	};
};
