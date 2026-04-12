'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
import {
	SearchInputOutlined,
	StatusBadge,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@dpm-core/shared';

import { getCohortListQuery } from '@/remotes/queries/cohort';
import { getMembersOverviewQuery } from '@/remotes/queries/member';

type SortKey = 'memberId' | 'name' | 'cohortId' | 'part' | 'status';
type SortOrder = 'asc' | 'desc';

const SORT_COLUMNS = [
	{ key: 'memberId', label: 'ID' },
	{ key: 'name', label: '이름' },
	{ key: 'cohortId', label: '기수' },
	{ key: 'part', label: '파트' },
	{ key: 'status', label: '상태' },
] as const;

const statusBadgeStatus = (status: string) => {
	switch (status) {
		case 'ACTIVE':
			return 'success';
		case 'PENDING':
			return 'pending';
		case 'INACTIVE':
			return 'warning';
		case 'WITHDRAWN':
			return 'error';
		default:
			return 'default';
	}
};

export const PermissionManagement = () => {
	const { data: membersData, isLoading: membersLoading } = useQuery(getMembersOverviewQuery());
	const { data: cohortsData } = useQuery(getCohortListQuery);

	const members = membersData?.data.members ?? [];
	const cohorts = cohortsData?.data.cohorts ?? [];
	const cohortMap = new Map(cohorts.map((c) => [c.cohortId, c.cohortNumber]));

	const [searchQuery, setSearchQuery] = useState('');
	const [sortKey, setSortKey] = useState<SortKey>('memberId');
	const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

	const handleSort = (key: SortKey) => {
		if (sortKey === key) {
			setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortKey(key);
			setSortOrder('asc');
		}
	};

	const filteredAndSortedMembers = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		const filtered = query
			? members.filter((m) => {
					const cohortNumber = cohortMap.get(m.cohortId) ?? String(m.cohortId);
					return (
						String(m.memberId).includes(query) ||
						m.name.toLowerCase().includes(query) ||
						m.part.toLowerCase().includes(query) ||
						m.status.toLowerCase().includes(query) ||
						cohortNumber.toLowerCase().includes(query)
					);
				})
			: members;

		return [...filtered].sort((a, b) => {
			const dir = sortOrder === 'asc' ? 1 : -1;
			switch (sortKey) {
				case 'memberId':
					return (a.memberId - b.memberId) * dir;
				case 'name':
					return a.name.localeCompare(b.name) * dir;
				case 'cohortId':
					return (a.cohortId - b.cohortId) * dir;
				case 'part':
					return a.part.localeCompare(b.part) * dir;
				case 'status':
					return a.status.localeCompare(b.status) * dir;
				default:
					return 0;
			}
		});
	}, [members, searchQuery, sortKey, sortOrder, cohortMap]);

	return (
		<div className="flex w-full flex-col gap-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="font-bold text-label-normal text-title1">권한 관리</span>
					<span className="font-medium text-body1 text-primary-normal">
						{filteredAndSortedMembers.length}
					</span>
				</div>
				<div className="w-[320px]">
					<SearchInputOutlined
						placeholder="ID, 이름, 파트, 상태 검색"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="h-10 w-full"
					/>
				</div>
			</div>

			{/* Table */}
			{membersLoading ? (
				<div className="flex min-h-[300px] w-full items-center justify-center py-12">
					<p className="font-medium text-body1 text-label-assistive">멤버 목록을 불러오는 중...</p>
				</div>
			) : filteredAndSortedMembers.length === 0 ? (
				<div className="flex min-h-[300px] w-full items-center justify-center py-12">
					<p className="font-medium text-body1 text-label-assistive">
						{searchQuery ? '검색 결과가 없습니다' : '등록된 멤버가 없습니다'}
					</p>
				</div>
			) : (
				<Table className="w-full">
					<TableHeader>
						<TableRow className="h-10 border-0 bg-background-strong hover:bg-background-strong">
							{SORT_COLUMNS.map((col) => (
								<TableHead key={col.key} className="px-3 font-medium text-body2 text-label-subtle">
									<button
										type="button"
										className="inline-flex cursor-pointer items-center gap-1"
										onClick={() => handleSort(col.key)}
									>
										{col.label}
										{sortKey === col.key &&
											(sortOrder === 'asc' ? (
												<ArrowUpAZ className="size-3.5" />
											) : (
												<ArrowDownAZ className="size-3.5" />
											))}
									</button>
								</TableHead>
							))}
							<TableHead className="w-[200px] px-3 text-right font-medium text-body2 text-label-subtle">
								관리
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredAndSortedMembers.map((m) => (
							<TableRow key={m.memberId} className="h-[56px] border-line-subtle">
								<TableCell className="px-3 font-medium text-body1 text-label-normal">
									{m.memberId}
								</TableCell>
								<TableCell className="px-3 font-medium text-body1 text-label-normal">
									{m.name}
								</TableCell>
								<TableCell className="px-3 font-medium text-body1 text-label-normal">
									{cohortMap.get(m.cohortId) ?? m.cohortId}기
								</TableCell>
								<TableCell className="px-3 font-medium text-body1 text-label-normal">
									{m.part}
								</TableCell>
								<TableCell className="px-3">
									<StatusBadge status={statusBadgeStatus(m.status)}>{m.status}</StatusBadge>
								</TableCell>
								<TableCell className="px-3 text-right font-medium text-body2 text-label-assistive">
									API 연동 후 추가 예정
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
};
