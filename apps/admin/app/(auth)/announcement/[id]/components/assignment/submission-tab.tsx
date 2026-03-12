'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import {
	AssignmentSubmitStatus,
	FilterDropdown,
	FilterPopover,
	Input,
	MultiActionToolbar,
	Popover,
	PopoverContent,
	PopoverTrigger,
	SearchInputOutlined,
	type SubmissionStatus,
	SubmissionStatusModal,
	TableCheckbox,
	TeamTabBar,
	ToggleButton,
	toast,
} from '@dpm-core/shared';

import { patchAssignmentStatusMutationOptions } from '@/remotes/mutations/announcement';
import {
	getAnnouncementAssignmentStatusQuery,
	getAnnouncementDetailQuery,
	getAnnouncementReadMembersQuery,
} from '@/remotes/queries/announcement';
import { getMyMemberInfoQuery } from '@/remotes/queries/member';

import {
	type Member,
	submitStatusToServer,
	toClientSubmitStatus,
	toServerSubmitStatus,
} from '../../types';

interface SubmissionStatusTabProps {
	announcementId: number;
	members: Member[];
}

export const SubmissionStatusTab = ({ announcementId, members }: SubmissionStatusTabProps) => {
	const queryClient = useQueryClient();
	const { mutate: patchAssignmentStatus } = useMutation(
		patchAssignmentStatusMutationOptions(announcementId),
	);

	const invalidateAssignmentQueries = () => {
		queryClient.invalidateQueries(getAnnouncementDetailQuery(announcementId));
		queryClient.invalidateQueries(getAnnouncementReadMembersQuery(announcementId));
		queryClient.invalidateQueries(getAnnouncementAssignmentStatusQuery(announcementId));
	};

	const {
		data: { data: myInfo },
	} = useSuspenseQuery(getMyMemberInfoQuery);

	const {
		data: { data: assignmentStatusData },
	} = useSuspenseQuery(getAnnouncementAssignmentStatusQuery(announcementId));

	// assignment-status API 데이터를 memberId 기준으로 빠르게 조회할 수 있는 맵
	const assignmentStatusMap = useMemo(
		() => new Map(assignmentStatusData.members.map((m) => [m.memberId, m])),
		[assignmentStatusData.members],
	);

	// members 데이터에 assignment-status API 데이터를 병합 (제출 상태 및 점수 초기 세팅)
	const enrichedMembers = useMemo<Member[]>(
		() =>
			members.map((m) => {
				const statusData = assignmentStatusMap.get(Number(m.id));
				if (!statusData) return m;
				return {
					...m,
					submitStatus: toClientSubmitStatus(statusData.submitStatus),
					score: statusData.score,
					submitLink: statusData.submitLink,
				};
			}),
		[members, assignmentStatusMap],
	);

	const [activeTeamTab, setActiveTeamTab] = useState('all');
	const [showMyTeamOnly, setShowMyTeamOnly] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());

	// 통합 필터 상태 관리
	const [filterOpen, setFilterOpen] = useState(false);
	const [filters, setFilters] = useState<Record<string, string[]>>({}); // 실제 적용된 필터
	const [tempFilters, setTempFilters] = useState<Record<string, string[]>>({}); // 팝오버 내에서 선택 중인 임시 필터

	// 제출 상태 모달 상태 관리
	const [statusModalOpen, setStatusModalOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<SubmissionStatus>('pending');

	// assignment-status API 데이터로 점수 초기 세팅
	const [scores, setScores] = useState<Record<string, string>>(() =>
		Object.fromEntries(
			assignmentStatusData.members
				.filter((m) => m.score != null)
				.map((m) => [String(m.memberId), String(m.score)]),
		),
	);

	// enrichedMembers 데이터에서 팀 목록 동적 추출
	const teamTabs = useMemo(() => {
		const teamIds = [...new Set(enrichedMembers.map((m) => m.teamId))].sort((a, b) => a - b);
		return [
			{ id: 'all', label: '전체' },
			...teamIds.map((id) => ({ id: String(id), label: `${id}팀` })),
		];
	}, [enrichedMembers]);

	// 필터링된 멤버 목록
	const filteredMembers = useMemo(() => {
		let result = enrichedMembers;

		// 내 팀만 보기
		if (showMyTeamOnly) {
			result = result.filter((m) => m.teamId === myInfo.teamNumber);
		}

		// 팀 탭 필터
		if (activeTeamTab !== 'all') {
			result = result.filter((m) => String(m.teamId) === activeTeamTab);
		}

		// 검색 필터
		if (searchQuery) {
			result = result.filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
		}

		// 조회별 필터
		const viewFilter = (filters.조회별 || [])[0];
		if (viewFilter) {
			result = result.filter((m) => (viewFilter === 'read' ? m.isRead : !m.isRead));
		}

		// 제출별 필터
		const submitFilter = (filters.제출별 || [])[0];
		if (submitFilter) {
			result = result.filter((m) =>
				submitFilter === 'submitted'
					? m.submitStatus !== 'not-submitted'
					: m.submitStatus === 'not-submitted',
			);
		}

		// 링크별 필터 - submitLink 유무 또는 제출 상태(submitted/late)로 판단
		const linkFilter = (filters.링크별 || [])[0];
		if (linkFilter) {
			result = result.filter((m) => {
				const hasLink =
					m.submitLink != null || m.submitStatus === 'completed' || m.submitStatus === 'late';
				return linkFilter === 'has-link' ? hasLink : !hasLink;
			});
		}

		return result;
	}, [enrichedMembers, showMyTeamOnly, myInfo.teamNumber, activeTeamTab, searchQuery, filters]);
	const handleSelectAll = (checked: boolean) => {
		if (checked) setSelectedMembers(new Set(filteredMembers.map(({ id }) => id)));
		else setSelectedMembers(new Set());
	};

	const handleSelectMember = (memberId: string, checked: boolean) => {
		const newSelected = new Set(selectedMembers);
		if (checked) newSelected.add(memberId);
		else newSelected.delete(memberId);

		setSelectedMembers(newSelected);
	};

	const isAllSelected =
		selectedMembers.size === filteredMembers.length && filteredMembers.length > 0;

	// 팝오버가 열릴 때 현재 적용된 필터를 임시 필터로 복사
	const handleFilterOpen = (open: boolean) => {
		if (open) setTempFilters(filters);

		setFilterOpen(open);
	};

	const handleFilterChange = (sectionLabel: string, value: string) => {
		setTempFilters((prev) => {
			const currentValues = prev[sectionLabel] || [];
			// 이미 선택된 값을 다시 클릭하면 선택 해제, 아니면 해당 값만 선택
			const newValues = currentValues.includes(value) ? [] : [value];

			return { ...prev, [sectionLabel]: newValues };
		});
	};

	const handleFilterReset = () => setTempFilters({});

	const handleFilterApply = () => {
		// 적용하기 버튼 클릭 시 임시 필터를 실제 필터에 적용
		setFilters(tempFilters);
		setFilterOpen(false);
	};

	// 각 필터 섹션별로 선택 여부 확인 (실제 적용된 필터 기준)
	const hasViewFilter = (filters.조회별 || []).length > 0;
	const hasSubmitFilter = (filters.제출별 || []).length > 0;
	const hasLinkFilter = (filters.링크별 || []).length > 0;

	const handleSubmissionRequest = () => {
		// TODO: 제출 요청 API 호출

		// API 구현 전까지 임시 처리
		toast.light('제출 요청 기능이 준비 중이에요.');
	};

	const handleStatusModalSave = () => {
		const memberIds = Array.from(selectedMembers).map(Number);

		patchAssignmentStatus(
			{ submitStatus: toServerSubmitStatus(selectedStatus), memberIds },
			{
				onSuccess: () => {
					invalidateAssignmentQueries();
					toast.light('제출 상태가 변경되었어요.');
					setStatusModalOpen(false);
				},
				onError: () => {
					toast.error('제출 상태 변경에 실패했어요.');
				},
			},
		);
	};

	const handleScoreSave = (memberId: string) => {
		const score = scores[memberId];
		if (!score || score.trim() === '') return;

		const numericScore = Number(score);
		if (Number.isNaN(numericScore)) {
			toast.error('점수는 숫자만 입력 가능해요.');
			return;
		}

		const member = enrichedMembers.find((m) => m.id === memberId);
		if (!member) return;

		patchAssignmentStatus(
			{
				submitStatus: submitStatusToServer(member.submitStatus ?? 'pending'),
				assignmentScore: numericScore,
				memberIds: [Number(memberId)],
			},
			{
				onSuccess: () => {
					invalidateAssignmentQueries();
					toast.light('점수가 저장되었어요.');
				},
				onError: () => {
					toast.error('점수 저장에 실패했어요.');
				},
			},
		);
	};

	const handleScoreChange = (memberId: string, score: string) =>
		setScores((prev) => ({ ...prev, [memberId]: score }));

	// 선택된 멤버들의 이름 목록
	const selectedMemberNames = enrichedMembers
		.filter((m) => selectedMembers.has(m.id))
		.map((m) => m.name);

	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-background-normal p-10">
			{/* 검색 및 필터 */}
			<div className="flex items-center justify-between pb-2">
				<SearchInputOutlined
					placeholder="디퍼 검색"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="h-10 w-60"
				/>

				<div className="flex items-center gap-2">
					<ToggleButton
						label="내 팀만 보기"
						id="my-team-only"
						checked={showMyTeamOnly}
						onCheckedChange={(checked) => setShowMyTeamOnly(checked as boolean)}
					/>
					<Popover open={filterOpen} onOpenChange={handleFilterOpen}>
						<div className="flex items-center gap-2">
							<PopoverTrigger asChild>
								<div>
									<FilterDropdown label="조회별" isSelected={hasViewFilter} />
								</div>
							</PopoverTrigger>
							<PopoverTrigger asChild>
								<div>
									<FilterDropdown label="제출별" isSelected={hasSubmitFilter} />
								</div>
							</PopoverTrigger>
							<PopoverTrigger asChild>
								<div>
									<FilterDropdown label="링크별" isSelected={hasLinkFilter} />
								</div>
							</PopoverTrigger>
						</div>
						<PopoverContent align="end" className="w-auto border-none p-0 shadow-none">
							<FilterPopover
								title="필터"
								sections={[
									{
										label: '조회별',
										options: [
											{ value: 'read', label: '읽음' },
											{ value: 'unread', label: '읽지 않음' },
										],
									},
									{
										label: '제출별',
										options: [
											{ value: 'submitted', label: '제출 함' },
											{ value: 'not-submitted', label: '제출 안 함' },
										],
									},
									{
										label: '링크별',
										options: [
											{ value: 'has-link', label: '링크 있음' },
											{ value: 'no-link', label: '링크 없음' },
										],
									},
								]}
								selectedValues={tempFilters}
								onClose={() => setFilterOpen(false)}
								onReset={handleFilterReset}
								onApply={handleFilterApply}
								onFilterChange={handleFilterChange}
							/>
						</PopoverContent>
					</Popover>
				</div>
			</div>

			{/* 팀 탭 */}
			<TeamTabBar
				tabs={teamTabs}
				activeTabId={activeTeamTab}
				onTabChange={setActiveTeamTab}
				className="border-b-0"
			/>

			{/* 다중 액션 툴바 */}
			<MultiActionToolbar
				totalCount={enrichedMembers.length}
				selectedCount={selectedMembers.size}
				actions={[
					{
						label: '제출 요청 보내기',
						onClick: handleSubmissionRequest,
					},
					{
						label: '제출 상태 수정하기',
						onClick: () => setStatusModalOpen(true),
					},
				]}
				active={selectedMembers.size > 0}
			/>

			{/* 테이블 */}
			<div className="flex-1 overflow-y-auto">
				<table className="w-full border-collapse">
					<thead className="sticky top-0 bg-background-strong">
						<tr className="h-10">
							<th className="w-10 px-3 text-left">
								<TableCheckbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
							</th>
							<th className="px-3 text-left font-medium text-body2 text-label-subtle">멤버 정보</th>
							<th className="w-35 px-3 text-left font-medium text-body2 text-label-subtle">
								제출 상태
							</th>
							<th className="w-35 px-3 text-left font-medium text-body2 text-label-subtle">
								과제 점수
							</th>
						</tr>
					</thead>
					<tbody>
						{filteredMembers.map(({ id, name, team, role, submitStatus }) => (
							<tr key={id} className="h-17.5 border-line-subtle border-b bg-background-normal">
								<td className="px-3">
									<TableCheckbox
										checked={selectedMembers.has(id)}
										onCheckedChange={(checked) => handleSelectMember(id, checked as boolean)}
									/>
								</td>
								<td className="px-3">
									<div className="flex items-center gap-2.5">
										<div className="size-10 shrink-0 rounded-full bg-gray-200" />
										<div className="flex flex-col gap-0.75">
											<p className="font-semibold text-body1 text-label-normal">{name}</p>
											<div className="flex items-center gap-1.5 text-body2 text-label-assistive">
												<span>{team}</span>
												<div className="h-4 w-px bg-gray-400" />
												<span>{role}</span>
											</div>
										</div>
									</div>
								</td>
								<td className="px-3">
									<AssignmentSubmitStatus status={submitStatus} />
								</td>
								<td className="px-3">
									<Input
										variant="line"
										placeholder="예) 100"
										className="h-10 w-full"
										value={scores[id] || ''}
										onChange={(e) => handleScoreChange(id, e.target.value)}
										onBlur={() => handleScoreSave(id)}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<SubmissionStatusModal
				open={statusModalOpen}
				onOpenChange={setStatusModalOpen}
				selectedStatus={selectedStatus}
				onStatusChange={setSelectedStatus}
				affectedUsers={selectedMemberNames}
				onSave={handleStatusModalSave}
			/>
		</div>
	);
};
