'use client';

import { DebouncedSearchInput } from '@/components/debounced-search-input';

import { formatLastUpdated } from '../_lib/format-last-updated';

interface MemberManagementHeaderProps {
	totalMemberCount: number;
	lastUpdatedAt: string | null;
	search: string;
	onSearchChange: (value: string) => void;
}

export const MemberManagementHeader = ({
	totalMemberCount,
	lastUpdatedAt,
	search,
	onSearchChange,
}: MemberManagementHeaderProps) => {
	const updatedLabel = formatLastUpdated(lastUpdatedAt);

	return (
		<>
			<header className="flex h-20 w-full items-center justify-between border-b border-line-normal px-10">
				<h1 className="flex items-center gap-2 text-headline1 font-bold text-label-normal">
					멤버 관리
					<span className="text-headline1 font-bold text-primary-normal">{totalMemberCount}</span>
				</h1>
				{updatedLabel && (
					<p className="text-body2 font-medium text-label-assistive">{updatedLabel} 업데이트됨</p>
				)}
			</header>

			<div className="flex w-full items-center justify-between px-10 pt-6">
				<h2 className="text-title2 font-bold text-label-normal">요약</h2>
				<DebouncedSearchInput
					value={search}
					onChange={onSearchChange}
					onClear={() => onSearchChange('')}
					placeholder="멤버 검색"
					containerClassName="w-67.5"
				/>
			</div>
		</>
	);
};
