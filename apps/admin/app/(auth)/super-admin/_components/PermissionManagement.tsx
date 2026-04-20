'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
import type { MemberOverviewItem } from '@dpm-core/api';
import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	SearchInputOutlined,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Skeleton,
	StatusBadge,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	toast,
} from '@dpm-core/shared';

import {
	updateMemberRoleMutationOptions,
	updateMemberStatusMutationOptions,
} from '@/remotes/mutations/member';
import { getCohortListQuery } from '@/remotes/queries/cohort';
import { getMembersOverviewQuery } from '@/remotes/queries/member';

type ActionType = 'role' | 'status';

type SortKey = 'memberId' | 'name' | 'cohortId' | 'part' | 'status';
type SortOrder = 'asc' | 'desc';

const STATUS_OPTIONS = [
	{ value: 'PENDING', label: 'PENDING' },
	{ value: 'ACTIVE', label: 'ACTIVE' },
	{ value: 'INACTIVE', label: 'INACTIVE' },
] as const;

const SORT_COLUMNS = [
	{ key: 'memberId', label: 'ID' },
	{ key: 'name', label: '이름' },
	{ key: 'cohortId', label: '기수' },
	{ key: 'part', label: '파트' },
	{ key: 'status', label: '상태' },
] as const;

const getErrorMessage = async (error: Error, fallback: string) => {
	if (error instanceof HTTPError) {
		try {
			const body = await error.response.json();
			if (body?.message) return body.message as string;
		} catch {
			// 파싱 실패 시 fallback 사용
		}
	}
	return fallback;
};

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
	const queryClient = useQueryClient();

	const {
		data: membersData,
		isLoading: membersLoading,
		isFetching: membersFething,
	} = useQuery(getMembersOverviewQuery());
	const { data: cohortsData } = useQuery(getCohortListQuery);

	const members = membersData?.data.members ?? [];
	const cohorts = cohortsData?.data.cohorts ?? [];
	const cohortMap = new Map(cohorts.map((c) => [c.cohortId, c.cohortNumber]));

	const [searchQuery, setSearchQuery] = useState('');
	const [sortKey, setSortKey] = useState<SortKey>('memberId');
	const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

	const [dialogOpen, setDialogOpen] = useState(false);
	const [actionType, setActionType] = useState<ActionType>('role');
	const [targetMember, setTargetMember] = useState<MemberOverviewItem | null>(null);
	const [selectedStatus, setSelectedStatus] = useState<'PENDING' | 'ACTIVE' | 'INACTIVE'>('ACTIVE');

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

	const invalidateMembers = () => {
		queryClient.invalidateQueries({ queryKey: ['members-overview'] });
	};

	const { mutate: updateRole, isPending: isRolePending } = useMutation(
		updateMemberRoleMutationOptions({
			onSuccess: () => {
				setDialogOpen(false);
				toast.success('역할이 변경되었습니다.');
				invalidateMembers();
			},
			onError: async (error) => {
				const message = await getErrorMessage(error, '역할 변경에 실패했습니다.');
				toast.error(message);
			},
		}),
	);

	const { mutate: updateStatus, isPending: isStatusPending } = useMutation(
		updateMemberStatusMutationOptions({
			onSuccess: () => {
				setDialogOpen(false);
				toast.success('멤버 상태가 변경되었습니다.');
				invalidateMembers();
			},
			onError: async (error) => {
				const message = await getErrorMessage(error, '상태 변경에 실패했습니다.');
				toast.error(message);
			},
		}),
	);

	const isPending = isRolePending || isStatusPending;

	const openDialog = (member: MemberOverviewItem, action: ActionType) => {
		setTargetMember(member);
		setActionType(action);
		setSelectedStatus('ACTIVE');
		setDialogOpen(true);
	};

	const handleConfirm = () => {
		if (!targetMember) return;

		switch (actionType) {
			case 'role': {
				const cohortNumber = cohortMap.get(targetMember.cohortId) ?? String(targetMember.cohortId);
				updateRole({
					memberId: targetMember.memberId,
					isAdmin: !targetMember.isAdmin,
					cohort: cohortNumber,
				});
				break;
			}
			case 'status':
				updateStatus({
					memberId: String(targetMember.memberId),
					memberStatus: selectedStatus,
				});
				break;
		}
	};

	const getDialogConfig = () => {
		const targetRole = targetMember?.isAdmin ? 'DEEPER' : 'ORGANIZER';
		switch (actionType) {
			case 'role':
				return {
					title: `${targetRole} 역할 변환`,
					description: `${targetMember?.name}(ID: ${targetMember?.memberId}) 멤버를 ${targetRole}로 변환하시겠습니까?`,
					confirmLabel: '변환',
				};
			case 'status':
				return {
					title: '멤버 상태 변경',
					description: `${targetMember?.name}(ID: ${targetMember?.memberId}) 멤버의 상태를 변경합니다.`,
					confirmLabel: '변경',
				};
		}
	};

	const dialogConfig = getDialogConfig();

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
				<div className="flex w-full flex-col">
					<div className="flex h-10 items-center gap-6 bg-background-strong px-3">
						<Skeleton className="h-4 w-8" />
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-4 w-12" />
						<Skeleton className="ml-auto h-4 w-12" />
					</div>
					{['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5'].map((key) => (
						<div
							key={key}
							className="flex h-14 items-center gap-6 border-line-subtle border-b px-3"
						>
							<Skeleton className="h-4 w-8" />
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-4 w-12" />
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-4 w-16" />
							<Skeleton className="ml-auto h-4 w-32" />
						</div>
					))}
				</div>
			) : filteredAndSortedMembers.length === 0 ? (
				<div className="flex min-h-75 w-full items-center justify-center py-12">
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
							<TableHead className="w-50 px-6 font-medium text-body2 text-label-subtle">
								관리
							</TableHead>
						</TableRow>
					</TableHeader>
					{membersFething && !membersLoading && (
						<TableBody>
							<TableRow className="h-0 border-0 p-0 hover:bg-transparent">
								<TableCell colSpan={6} className="h-0 border-0 p-0">
									<div className="h-0.5 w-full overflow-hidden bg-background-strong">
										<div
											className="h-full w-1/3 bg-primary-normal"
											style={{ animation: 'progress 1s ease-in-out infinite' }}
										/>
									</div>
									<style>{`@keyframes progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }`}</style>
								</TableCell>
							</TableRow>
						</TableBody>
					)}
					<TableBody>
						{filteredAndSortedMembers.map((m) => (
							<TableRow key={m.memberId} className="h-12 border-line-subtle">
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
								<TableCell className="flex items-center justify-end gap-2 px-3">
									<button
										type="button"
										className="cursor-pointer rounded-md px-3 py-1.5 font-medium text-body2 text-label-normal hover:bg-background-strong"
										onClick={() => openDialog(m, 'role')}
									>
										{m.isAdmin ? 'DEEPER 변환' : 'ORGANIZER 변환'}
									</button>
									<button
										type="button"
										className="cursor-pointer rounded-md px-3 py-1.5 font-medium text-body2 text-label-normal hover:bg-background-strong"
										onClick={() => openDialog(m, 'status')}
									>
										상태 변경
									</button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
			{/* Action Dialog */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{dialogConfig.title}</DialogTitle>
						<DialogDescription>{dialogConfig.description}</DialogDescription>
					</DialogHeader>

					{actionType === 'status' && (
						<Select
							value={selectedStatus}
							onValueChange={(value) => setSelectedStatus(value as 'PENDING' | 'ACTIVE' | 'INACTIVE')}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="상태 선택" />
							</SelectTrigger>
							<SelectContent>
								{STATUS_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}

					<DialogFooter>
						<DialogClose asChild>
							<Button variant="assistive">취소</Button>
						</DialogClose>
						<Button onClick={handleConfirm} disabled={isPending}>
							{isPending ? '처리 중...' : dialogConfig.confirmLabel}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			;
		</div>
	);
};
