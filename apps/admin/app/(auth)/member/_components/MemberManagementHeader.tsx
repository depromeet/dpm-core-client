'use client';

import { SearchInputOutlined } from '@dpm-core/shared';

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
			<header className="flex h-20 w-full items-center justify-between border-line-normal border-b px-10">
				<h1 className="flex items-center gap-2 font-bold text-headline1 text-label-normal">
					멤버 관리
					<span className="font-bold text-headline1 text-primary-normal">{totalMemberCount}</span>
				</h1>
				{updatedLabel && (
					<p className="font-medium text-body2 text-label-assistive">{updatedLabel} 업데이트됨</p>
				)}
			</header>

			<div className="flex w-full items-center justify-between px-10 pt-6">
				<h2 className="font-bold text-label-normal text-title2">요약</h2>
				<SearchInputOutlined
					placeholder="멤버 검색"
					value={search}
					onChange={(event) => onSearchChange(event.target.value)}
					data-clarity-mask="True"
					className="h-10 w-67.5 bg-background-normal"
				/>
			</div>
		</>
	);
};
