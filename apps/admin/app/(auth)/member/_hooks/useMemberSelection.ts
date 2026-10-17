'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * 체크박스 선택만 책임지는 훅.
 * 목록이 무한 스크롤로 늘어나므로 선택은 id 집합으로 들고 있고,
 * 조건(resetKey)이 바뀌면 화면에서 사라진 선택이 남지 않도록 비운다.
 */
export const useMemberSelection = (visibleIds: number[], resetKey: unknown) => {
	const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

	// resetKey 는 effect 안에서 쓰지 않지만, 값이 바뀌었다는 사실 자체가 선택을 비우는 신호다.
	// biome-ignore lint/correctness/useExhaustiveDependencies: resetKey 변경을 감지하기 위한 의존성
	useEffect(() => {
		setSelectedIds(new Set());
	}, [resetKey]);

	const toggle = useCallback((id: number) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}, []);

	const isAllSelected = useMemo(
		() => visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id)),
		[visibleIds, selectedIds],
	);

	const toggleAll = useCallback(() => {
		setSelectedIds((prev) => {
			const allSelected = visibleIds.length > 0 && visibleIds.every((id) => prev.has(id));
			if (allSelected) return new Set();
			return new Set(visibleIds);
		});
	}, [visibleIds]);

	const clear = useCallback(() => setSelectedIds(new Set()), []);

	const deselect = useCallback((ids: number[]) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			for (const id of ids) next.delete(id);
			return next;
		});
	}, []);

	return {
		selectedIds,
		selectedIdList: useMemo(() => Array.from(selectedIds), [selectedIds]),
		isSelected: useCallback((id: number) => selectedIds.has(id), [selectedIds]),
		isAllSelected,
		toggle,
		toggleAll,
		clear,
		deselect,
	};
};
