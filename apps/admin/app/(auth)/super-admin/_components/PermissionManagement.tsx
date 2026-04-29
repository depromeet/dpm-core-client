'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { ArrowDownAZ, ArrowUpAZ, Plus } from 'lucide-react';
import { member, type MemberOverviewItem } from '@dpm-core/api';
import {
	Button,
	cn,
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
import { getMembersOverviewQuery, getMembersRolesQuery } from '@/remotes/queries/member';

type ActionType = 'role' | 'status' | 'add-cohort';

type SortKey = 'memberId' | 'name' | 'cohortRoles' | 'part' | 'status';
type SortOrder = 'asc' | 'desc';

interface CohortRole {
	cohortNumber: string;
	isAdmin: boolean;
}

const STATUS_OPTIONS = [
	{ value: 'PENDING', label: 'PENDING' },
	{ value: 'ACTIVE', label: 'ACTIVE' },
	{ value: 'INACTIVE', label: 'INACTIVE' },
] as const;

const SORT_COLUMNS = [
	{ key: 'memberId', label: 'ID' },
	{ key: 'name', label: '이름' },
	{ key: 'cohortRoles', label: '기수별 역할' },
	{ key: 'part', label: '파트' },
	{ key: 'status', label: '상태' },
] as const;

// 기수 참여 역할 파싱:
//  - "{N}기 디퍼" / "{N}기 운영진" : 명시적 권한 (cohortNumber 기준)
//  - "코어 {cohortId}기"            : init API로 부여되는 베이스 멤버십. cohortMap으로 cohortNumber 변환
const EXPLICIT_ROLE_PATTERN = /^(\d+)기\s+(디퍼|운영진)$/;
const BASE_ROLE_PATTERN = /^코어\s+(\d+)기$/;

const parseCohortRoles = (
	roles: string[],
	cohortIdToNumber: Map<number, string>,
): CohortRole[] => {
	const map = new Map<string, CohortRole>();
	const baseSet = new Set<string>();
	for (const r of roles) {
		const explicit = EXPLICIT_ROLE_PATTERN.exec(r);
		if (explicit) {
			map.set(explicit[1], {
				cohortNumber: explicit[1],
				isAdmin: explicit[2] === '운영진',
			});
			continue;
		}
		const base = BASE_ROLE_PATTERN.exec(r);
		if (base) {
			const number = cohortIdToNumber.get(Number(base[1]));
			if (number) baseSet.add(number);
		}
	}
	// 명시 권한이 없는 베이스만 디퍼로 채움 (운영진 등 명시 권한이 우선)
	for (const number of baseSet) {
		if (!map.has(number)) {
			map.set(number, { cohortNumber: number, isAdmin: false });
		}
	}
	return [...map.values()].sort((a, b) => Number(a.cohortNumber) - Number(b.cohortNumber));
};

const formatCohortRoles = (cohortRoles: CohortRole[]) =>
	cohortRoles.map((r) => `${r.cohortNumber}기 ${r.isAdmin ? '운영진' : '디퍼'}`).join(' · ');

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

	const memberIds = useMemo(() => members.map((m) => m.memberId), [members]);
	const { data: rolesData, isFetching: rolesFetching } = useQuery(getMembersRolesQuery(memberIds));

	const cohortIdToNumber = useMemo(
		() => new Map(cohorts.map((c) => [c.cohortId, c.cohortNumber])),
		[cohorts],
	);

	const cohortRolesMap = useMemo(() => {
		const map = new Map<number, CohortRole[]>();
		for (const item of rolesData?.data.members ?? []) {
			map.set(item.memberId, parseCohortRoles(item.roles, cohortIdToNumber));
		}
		return map;
	}, [rolesData, cohortIdToNumber]);

	const [searchQuery, setSearchQuery] = useState('');
	const [sortKey, setSortKey] = useState<SortKey>('memberId');
	const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

	const [dialogOpen, setDialogOpen] = useState(false);
	const [actionType, setActionType] = useState<ActionType>('role');
	const [targetMember, setTargetMember] = useState<MemberOverviewItem | null>(null);
	const [selectedStatus, setSelectedStatus] = useState<'PENDING' | 'ACTIVE' | 'INACTIVE'>('ACTIVE');
	const [selectedCohort, setSelectedCohort] = useState<string>('');
	const [addCohortId, setAddCohortId] = useState<string>('');

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
					const roles = cohortRolesMap.get(m.memberId) ?? [];
					const roleLabel = formatCohortRoles(roles).toLowerCase();
					return (
						String(m.memberId).includes(query) ||
						m.name.toLowerCase().includes(query) ||
						m.part.toLowerCase().includes(query) ||
						m.status.toLowerCase().includes(query) ||
						roleLabel.includes(query)
					);
				})
			: members;

		const firstCohortNumber = (id: number): number => {
			const roles = cohortRolesMap.get(id);
			if (roles && roles.length > 0) return Number(roles[0].cohortNumber);
			return Number.POSITIVE_INFINITY;
		};

		return [...filtered].sort((a, b) => {
			const dir = sortOrder === 'asc' ? 1 : -1;
			switch (sortKey) {
				case 'memberId':
					return (a.memberId - b.memberId) * dir;
				case 'name':
					return a.name.localeCompare(b.name) * dir;
				case 'cohortRoles':
					return (firstCohortNumber(a.memberId) - firstCohortNumber(b.memberId)) * dir;
				case 'part':
					return a.part.localeCompare(b.part) * dir;
				case 'status':
					return a.status.localeCompare(b.status) * dir;
				default:
					return 0;
			}
		});
	}, [members, searchQuery, sortKey, sortOrder, cohortRolesMap]);

	const invalidateAll = async () => {
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ['members-roles'], refetchType: 'all' }),
			queryClient.invalidateQueries({ queryKey: ['members-overview'], refetchType: 'all' }),
		]);
	};

	const { mutate: updateRole, isPending: isRolePending } = useMutation(
		updateMemberRoleMutationOptions({
			onSuccess: () => {
				setDialogOpen(false);
				toast.success('역할이 변경되었습니다.');
				invalidateAll();
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
				queryClient.invalidateQueries({ queryKey: ['members-overview'] });
			},
			onError: async (error) => {
				const message = await getErrorMessage(error, '상태 변경에 실패했습니다.');
				toast.error(message);
			},
		}),
	);

	const { mutate: initCohort, isPending: isInitPending } = useMutation({
		mutationKey: ['members', 'add-cohort-with-role'],
		mutationFn: async ({ memberId, cohortId }: { memberId: number; cohortId: number }) => {
			// 1) 출석부/공지/회식 등록 + overview cohortId 갱신
			await member.initCohortMember({ memberId, cohortId });
			// 2) 해당 기수 디퍼 역할 부여 (init 단독으로는 role이 안 붙음)
			const cohortNumber = cohortIdToNumber.get(cohortId);
			if (cohortNumber) {
				await member.updateMemberRole(memberId, { isAdmin: false, cohort: cohortNumber });
			}
		},
		onSuccess: () => {
			setDialogOpen(false);
			toast.success('기수에 추가되었습니다.');
			invalidateAll();
		},
		onError: async (error: Error) => {
			const message = await getErrorMessage(error, '기수 추가에 실패했습니다.');
			toast.error(message);
		},
	});

	const isPending = isRolePending || isStatusPending || isInitPending;

	const openRoleDialog = (member: MemberOverviewItem, cohortNumber: string) => {
		setTargetMember(member);
		setActionType('role');
		setSelectedCohort(cohortNumber);
		setDialogOpen(true);
	};

	const openStatusDialog = (member: MemberOverviewItem) => {
		setTargetMember(member);
		setActionType('status');
		setSelectedStatus('ACTIVE');
		setDialogOpen(true);
	};

	const openAddCohortDialog = (member: MemberOverviewItem) => {
		setTargetMember(member);
		setActionType('add-cohort');
		setAddCohortId('');
		setDialogOpen(true);
	};

	const targetCohortRoles = targetMember
		? (cohortRolesMap.get(targetMember.memberId) ?? [])
		: [];
	const selectedCohortRole = targetCohortRoles.find((r) => r.cohortNumber === selectedCohort);

	const availableCohortsToAdd = useMemo(() => {
		if (!targetMember) return [];
		const existing = new Set(targetCohortRoles.map((r) => r.cohortNumber));
		return cohorts.filter((c) => !existing.has(c.cohortNumber));
	}, [targetMember, targetCohortRoles, cohorts]);

	const handleConfirm = () => {
		if (!targetMember) return;

		switch (actionType) {
			case 'role': {
				if (!selectedCohortRole) return;
				updateRole({
					memberId: targetMember.memberId,
					isAdmin: !selectedCohortRole.isAdmin,
					cohort: selectedCohortRole.cohortNumber,
				});
				break;
			}
			case 'status':
				updateStatus({
					memberId: String(targetMember.memberId),
					memberStatus: selectedStatus,
				});
				break;
			case 'add-cohort': {
				if (!addCohortId) return;
				initCohort({
					memberId: targetMember.memberId,
					cohortId: Number(addCohortId),
				});
				break;
			}
		}
	};

	const getDialogConfig = () => {
		switch (actionType) {
			case 'role': {
				const nextRoleLabel = selectedCohortRole
					? selectedCohortRole.isAdmin
						? 'DEEPER'
						: 'ORGANIZER'
					: '';
				return {
					title: selectedCohortRole
						? `${selectedCohortRole.cohortNumber}기 역할 변경`
						: '기수별 역할 변경',
					description:
						targetMember && selectedCohortRole
							? `${targetMember.name}(ID: ${targetMember.memberId})님의 ${selectedCohortRole.cohortNumber}기 역할을 ${selectedCohortRole.isAdmin ? '디퍼' : '운영진'}(으)로 변환합니다.`
							: '',
					confirmLabel: nextRoleLabel ? `${nextRoleLabel}로 변환` : '변환',
				};
			}
			case 'status':
				return {
					title: '멤버 상태 변경',
					description: `${targetMember?.name}(ID: ${targetMember?.memberId}) 멤버의 상태를 변경합니다.`,
					confirmLabel: '변경',
				};
			case 'add-cohort':
				return {
					title: '기수 추가',
					description: targetMember
						? `${targetMember.name}(ID: ${targetMember.memberId}) 멤버를 새 기수에 추가합니다. 출석부, 공지/과제, 회식에 자동 포함되며 기본 역할은 디퍼입니다.`
						: '',
					confirmLabel: '추가',
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
						placeholder="ID, 이름, 파트, 상태, 기수 검색"
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
							<Skeleton className="h-4 w-32" />
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
							<TableHead className="w-32 px-6 font-medium text-body2 text-label-subtle">
								관리
							</TableHead>
						</TableRow>
					</TableHeader>
					{(membersFething || rolesFetching) && !membersLoading && (
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
						{filteredAndSortedMembers.map((m) => {
							const roles = cohortRolesMap.get(m.memberId) ?? [];
							return (
								<TableRow key={m.memberId} className="h-12 border-line-subtle">
									<TableCell className="px-3 font-medium text-body1 text-label-normal">
										{m.memberId}
									</TableCell>
									<TableCell className="px-3 font-medium text-body1 text-label-normal">
										{m.name}
									</TableCell>
									<TableCell className="px-3 font-medium text-body1 text-label-normal">
										<div className="flex flex-wrap items-center gap-1.5">
											{roles.length === 0 ? (
												<span className="text-label-assistive">미배정</span>
											) : (
												roles.map((r) => (
													<button
														key={r.cohortNumber}
														type="button"
														title={`클릭하여 ${r.isAdmin ? '디퍼' : '운영진'}(으)로 변환`}
														className={cn(
															'cursor-pointer rounded-md border px-2 py-0.5 font-medium text-body2 transition-colors',
															r.isAdmin
																? 'border-primary-normal/30 bg-primary-normal/10 text-primary-normal hover:bg-primary-normal/20'
																: 'border-line-normal bg-background-strong text-label-normal hover:bg-background-stronger',
														)}
														onClick={() => openRoleDialog(m, r.cohortNumber)}
													>
														{r.cohortNumber}기 {r.isAdmin ? '운영진' : '디퍼'}
													</button>
												))
											)}
											<button
												type="button"
												title="기수 추가"
												className="inline-flex cursor-pointer items-center gap-0.5 rounded-md border border-line-normal border-dashed px-2 py-0.5 font-medium text-body2 text-label-subtle hover:bg-background-strong hover:text-label-normal"
												onClick={() => openAddCohortDialog(m)}
											>
												<Plus className="size-3" />
												기수 추가
											</button>
										</div>
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
											className="cursor-pointer rounded-md border border-line-normal px-3 py-1.5 font-medium text-body2 text-label-normal hover:bg-background-strong"
											onClick={() => openStatusDialog(m)}
										>
											상태 변경
										</button>
									</TableCell>
								</TableRow>
							);
						})}
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

					{actionType === 'role' && selectedCohortRole && (
						<div className="flex flex-col gap-1 rounded-md bg-background-strong px-3 py-2">
							<span className="font-medium text-body2 text-label-subtle">
								{selectedCohortRole.cohortNumber}기 현재:{' '}
								{selectedCohortRole.isAdmin ? '운영진 (ORGANIZER)' : '디퍼 (DEEPER)'}
							</span>
							<span className="font-medium text-body2 text-primary-normal">
								변경 후: {selectedCohortRole.isAdmin ? '디퍼 (DEEPER)' : '운영진 (ORGANIZER)'}
							</span>
						</div>
					)}

					{actionType === 'status' && (
						<Select
							value={selectedStatus}
							onValueChange={(value) =>
								setSelectedStatus(value as 'PENDING' | 'ACTIVE' | 'INACTIVE')
							}
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

					{actionType === 'add-cohort' && (
						<div className="flex flex-col gap-2">
							<span className="font-medium text-body2 text-label-subtle">추가할 기수</span>
							{availableCohortsToAdd.length === 0 ? (
								<span className="font-medium text-body2 text-label-assistive">
									추가할 수 있는 기수가 없습니다.
								</span>
							) : (
								<Select value={addCohortId} onValueChange={setAddCohortId}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="기수 선택" />
									</SelectTrigger>
									<SelectContent>
										{availableCohortsToAdd.map((c) => (
											<SelectItem key={c.cohortId} value={String(c.cohortId)}>
												{c.cohortNumber}기
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						</div>
					)}

					<DialogFooter>
						<DialogClose asChild>
							<Button variant="assistive">취소</Button>
						</DialogClose>
						<Button
							onClick={handleConfirm}
							disabled={
								isPending ||
								(actionType === 'role' && !selectedCohortRole) ||
								(actionType === 'add-cohort' && !addCohortId)
							}
						>
							{isPending ? '처리 중...' : dialogConfig.confirmLabel}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
