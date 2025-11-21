import { useCallback, useMemo, useState } from 'react';

export const useCheckboxSelection = <T extends { id: number }>(items: T[]) => {
	const [selectedIds, setSelectedIds] = useState<number[]>([]);

	const toggleItem = useCallback((id: number) => {
		setSelectedIds((prev) => {
			if (prev.includes(id)) {
				return prev.filter((selectedId) => selectedId !== id);
			}
			return [...prev, id];
		});
	}, []);

	const toggleAll = useCallback(() => {
		const currentItemIds = items.map((item) => item.id);
		const allCurrentSelected = currentItemIds.every((id) => selectedIds.includes(id));

		if (allCurrentSelected) {
			// 현재 items의 모든 id를 선택 해제
			setSelectedIds((prev) => prev.filter((id) => !currentItemIds.includes(id)));
		} else {
			// 현재 items의 모든 id를 선택 (기존 선택 유지하면서 중복 제거)
			setSelectedIds((prev) => {
				const newIds = currentItemIds.filter((id) => !prev.includes(id));
				return [...prev, ...newIds];
			});
		}
	}, [items, selectedIds]);

	const clearSelection = useCallback(() => {
		setSelectedIds([]);
	}, []);

	const isAllSelected = useMemo(() => {
		if (items.length === 0) return false;
		return items.every((item) => selectedIds.includes(item.id));
	}, [items, selectedIds]);

	return {
		selectedIds,
		toggleItem,
		toggleAll,
		isAllSelected,
		clearSelection,
	};
};
