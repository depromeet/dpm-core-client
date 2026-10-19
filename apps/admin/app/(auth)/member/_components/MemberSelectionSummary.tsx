'use client';

import { CircleX } from 'lucide-react';

interface MemberSelectionSummaryProps {
	selectedCount: number;
	totalCount: number;
	onClear: () => void;
}

/** 몇 명을 골랐는지 알려주고 한 번에 선택을 풀 수 있게 한다. */
export const MemberSelectionSummary = ({
	selectedCount,
	totalCount,
	onClear,
}: MemberSelectionSummaryProps) => {
	if (selectedCount === 0) {
		return <span className="font-medium text-body2 text-label-subtle">전체 {totalCount}명</span>;
	}

	return (
		<span className="flex items-center gap-1.5 font-medium text-body2 text-primary-normal">
			선택한 {selectedCount}명 선택됨
			<button type="button" onClick={onClear} aria-label="선택 해제" className="cursor-pointer">
				<CircleX className="size-4 text-label-assistive" />
			</button>
		</span>
	);
};
