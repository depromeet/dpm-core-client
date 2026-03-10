'use client';

/** 멤버 관리 페이지 */
import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
	SearchInputOutlined,
	Table,
	TableBody,
	TableCell,
	TableCheckbox,
	TableHead,
	TableHeader,
	TableRow,
	toast,
} from '@dpm-core/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import EtcIcon from '@/assets/icons/etc.webp';
import { LoadingBox } from '@/components/loading-box';
import { Profile } from '@/components/attendance/profile';
import { cohort } from '@/constants/cohort';
import { isExistPart } from '@/lib/utils';
import {
	approveWhitelistMutationOptions,
	updateMembersInitMutationOptions,
} from '@/remotes/mutations/member';
import { getMembersOverviewQuery } from '@/remotes/queries/member';

import { mapMemberOverviewToListItem } from '../_lib/map-overview-to-list-item';
import type { MemberListItem } from '../_types';
import { ApproveMemberModal } from './ApproveMemberModal';
import { EditMemberModal } from './EditMemberModal';
import { MemberFilter, type MemberFilterValues } from './MemberFilter';
import { MemberStatusLabel } from './MemberStatusLabel';

export const MemberList = () => {
	const queryClient = useQueryClient();
	const { data, isLoading } = useQuery(getMembersOverviewQuery);

	const members = useMemo(() => {
		if (!data?.data?.members) return [];
		return data.data.members.map(mapMemberOverviewToListItem);
	}, [data]);

	const [searchQuery, setSearchQuery] = useState('');
	const [filterValues, setFilterValues] = useState<MemberFilterValues>({
		unapprovedOnly: true,
		parts: [],
		teams: [],
	});
	const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
	const [approveModalOpen, setApproveModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);

	const filteredMembers = useMemo(() => {
		let result = members;

		if (filterValues.unapprovedOnly) {
			result = result.filter((m) => m.status === 'PENDING');
		}
		if (filterValues.parts.length > 0) {
			result = result.filter((m) => filterValues.parts.includes(m.part));
		}
		if (filterValues.teams.length > 0) {
			result = result.filter((m) => filterValues.teams.includes(String(m.teamNumber)));
		}
		if (searchQuery.trim()) {
			result = result.filter((m) =>
				m.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
			);
		}

		return result;
	}, [members, filterValues, searchQuery]);

	const pendingCount = useMemo(
		() => members.filter((m) => m.status === 'PENDING').length,
		[members],
	);

	const isAllSelected =
		filteredMembers.length > 0 && filteredMembers.every((m) => selectedIds.has(m.id));

	const isApproveEnabled =
		selectedIds.size > 0 &&
		Array.from(selectedIds).every((id) => {
			const member = members.find((m) => m.id === id);
			return member?.status === 'PENDING';
		});

	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			setSelectedIds(new Set(filteredMembers.map((m) => m.id)));
		} else {
			setSelectedIds(new Set());
		}
	};

	const handleSelectOne = (id: number, checked: boolean) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (checked) next.add(id);
			else next.delete(id);
			return next;
		});
	};

	const membersToApprove = useMemo(
		() =>
			Array.from(selectedIds)
				.map((id) => members.find((m) => m.id === id))
				.filter((m): m is MemberListItem => m != null && m.status === 'PENDING'),
		[selectedIds, members],
	);

	const { mutate: approveMembers } = useMutation(
		approveWhitelistMutationOptions({
			onSuccess: (_data, variables) => {
				setSelectedIds((prev) => {
					const next = new Set(prev);
					for (const id of variables.members) next.delete(id);
					return next;
				});
				queryClient.invalidateQueries({ queryKey: getMembersOverviewQuery.queryKey });
				setApproveModalOpen(false);
				toast.success('승인 완료했습니다.');
			},
			onError: () => {
				toast.error('승인에 실패했습니다.');
			},
		}),
	);

	const handleApproveClick = () => {
		setApproveModalOpen(true);
	};

	const handleApproveConfirm = () => {
		approveMembers({
			members: membersToApprove.map((m) => m.id),
		});
	};

	const handleReject = () => {
		// 반려: 모달만 닫음 (API 호출 없음)
	};

	const membersToEdit = useMemo(
		() =>
			Array.from(selectedIds)
				.map((id) => members.find((m) => m.id === id))
				.filter((m): m is MemberListItem => m != null),
		[selectedIds, members],
	);

	const handleEditClick = () => {
		setEditModalOpen(true);
	};

	const { mutate: updateMembers, isPending: isUpdatePending } = useMutation(
		updateMembersInitMutationOptions({
			onSuccess: () => {
				setSelectedIds(new Set());
				queryClient.invalidateQueries({ queryKey: getMembersOverviewQuery.queryKey });
				setEditModalOpen(false);
				toast.success('수정 완료했습니다.');
			},
			onError: () => {
				toast.error('수정에 실패했습니다.');
			},
		}),
	);

	const handleEditSubmit = (part: import('@dpm-core/api').Part, teamNumber: number) => {
		updateMembers({
			members: membersToEdit.map((m) => ({
				memberId: m.id,
				memberPart: part,
				team: String(teamNumber),
				status: m.status,
			})),
		});
	};

	if (isLoading) return <LoadingBox />;

	return (
		<div className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-10 bg-background-normal px-4 pt-8 md:px-10">
			<div className="flex w-full max-w-[1120px] flex-col items-start">
				{/* 멤버 승인 섹션 */}
				<div className="mb-[10px] flex w-full items-start">
					<div className="flex h-10 flex-row items-center gap-2">
						<span className="font-bold text-label-normal text-title1 tracking-[-0.01em]">
							멤버 승인
						</span>
						<span className="font-medium text-body1 text-primary-normal">{pendingCount}</span>
					</div>
				</div>

				{/* Search & Filter */}
				<div className="mb-[18px] flex w-full flex-row items-center justify-between">
					<div className="w-[270px]">
						<SearchInputOutlined
							placeholder="디퍼 검색"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="h-10 w-full"
						/>
					</div>
					<MemberFilter values={filterValues} onChange={setFilterValues} />
				</div>

				{/* Multi Action Toolbar */}
				<div className="flex w-full flex-row items-center gap-4 border-line-subtle border-t py-3">
					<span className="flex-1 font-medium text-body1 text-label-subtle">
						전체 {filteredMembers.length}명
					</span>
					<div className="flex flex-row items-center gap-2">
						<button
							type="button"
							className="flex h-10 items-center justify-center rounded-lg bg-background-inverse px-4 py-3 font-semibold text-body2 text-label-inverse transition-opacity disabled:opacity-40"
							disabled={!isApproveEnabled}
							onClick={handleApproveClick}
						>
							승인하기
						</button>
						<button
							type="button"
							className="flex h-10 items-center justify-center rounded-lg bg-background-inverse px-4 py-3 font-semibold text-body2 text-label-inverse transition-opacity disabled:opacity-40"
							disabled={selectedIds.size === 0}
							onClick={handleEditClick}
						>
							수정하기
						</button>
					</div>
				</div>

				{/* Table */}
				<div className="flex w-full flex-col items-start">
					{filteredMembers.length === 0 ? (
						<div className="flex min-h-[200px] w-full items-center justify-center py-12">
							<p className="font-medium text-body1 text-label-assistive">
								조건에 맞는 디퍼를 찾을 수 없어요
							</p>
						</div>
					) : (
						<Table className="table-fixed w-full">
							<TableHeader>
								<TableRow className="h-10 border-0 bg-background-strong hover:bg-background-strong">
									<TableHead className="w-10 px-3 [&:has([role=checkbox])]:pr-0">
										<TableCheckbox
											checked={isAllSelected}
											onCheckedChange={(checked) => handleSelectAll(checked === true)}
											aria-label="전체 선택"
										/>
									</TableHead>
									<TableHead className="px-3 font-medium text-body2 text-label-subtle">
										멤버 정보
									</TableHead>
									<TableHead className="w-[200px] px-3 font-medium text-body2 text-label-subtle">
										활동 상태
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredMembers.map((member) => (
									<TableRow
										key={member.id}
										className={`h-[70px] cursor-pointer border-line-subtle ${member.status === 'PENDING' ? 'bg-background-pending hover:bg-background-pending-hover' : 'bg-background-normal'}`}
										onClick={() => handleSelectOne(member.id, !selectedIds.has(member.id))}
									>
										<TableCell
											className="w-10 px-3 [&:has([role=checkbox])]:pr-0"
											onClick={(e) => e.stopPropagation()}
										>
											<TableCheckbox
												checked={selectedIds.has(member.id)}
												onCheckedChange={(checked) => handleSelectOne(member.id, checked === true)}
												aria-label={`${member.name} 선택`}
											/>
										</TableCell>
										<TableCell className="p-3">
											{member.part === 'ETC' || member.teamNumber === 0 ? (
												<div className="flex items-center gap-4">
													<div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background-strong">
														{member.part === 'ETC' ? (
															<Image
																src={EtcIcon}
																alt="파트 미배정"
																width={40}
																height={40}
																className="size-10 object-cover"
															/>
														) : (
															<Image
																src={isExistPart(member.part) ? cohort[member.part] : cohort.WEB}
																alt={`${member.part} 파트`}
																width={40}
																height={40}
																className="size-10 object-cover"
															/>
														)}
													</div>
													<div className="flex flex-col gap-0.5">
														<span className="font-semibold text-body1 text-label-normal">
															{member.name}
														</span>
														<span className="text-caption1 text-label-assistive">미배정</span>
													</div>
												</div>
											) : (
												<Profile
													size={40}
													name={member.name}
													teamNumber={member.teamNumber}
													part={member.part}
												/>
											)}
										</TableCell>
										<TableCell className="w-[200px] px-3">
											<MemberStatusLabel status={member.status} />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</div>
			</div>

			<ApproveMemberModal
				open={approveModalOpen}
				onOpenChange={setApproveModalOpen}
				members={membersToApprove}
				onApprove={handleApproveConfirm}
				onReject={handleReject}
			/>
			<EditMemberModal
				open={editModalOpen}
				onOpenChange={setEditModalOpen}
				members={membersToEdit}
				onSubmit={handleEditSubmit}
				isPending={isUpdatePending}
			/>
		</div>
	);
};
