'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
	type SubmitStatus,
	TableCheckbox,
	TeamTabBar,
	ToggleButton,
	toast,
} from '@dpm-core/shared';

import { patchAssignmentStatusMutationOptions } from '@/remotes/mutations/announcement';
import { getAnnouncementDetailQuery } from '@/remotes/queries/announcement';

interface Member {
	id: string;
	name: string;
	team: string;
	role: string;
	submitStatus: SubmitStatus;
}

interface SubmissionStatusTabProps {
	announcementId: number;
	members: Member[];
}

export const SubmissionStatusTab = ({ announcementId, members }: SubmissionStatusTabProps) => {
	const queryClient = useQueryClient();
	const { mutate: patchAssignmentStatus } = useMutation(
		patchAssignmentStatusMutationOptions(announcementId, {
			onSuccess: () => {
				queryClient.invalidateQueries(getAnnouncementDetailQuery(announcementId));
			},
			onError: () => {
				toast.error('제출 상태 변경에 실패했어요.');
			},
		}),
	);

	const [activeTeamTab, setActiveTeamTab] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());

	// 통합 필터 상태 관리
	const [filterOpen, setFilterOpen] = useState(false);
	const [filters, setFilters] = useState<Record<string, string[]>>({}); // 실제 적용된 필터
	const [tempFilters, setTempFilters] = useState<Record<string, string[]>>({}); // 팝오버 내에서 선택 중인 임시 필터

	// 제출 상태 모달 상태 관리
	const [statusModalOpen, setStatusModalOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<SubmissionStatus>('pending');

	const handleSelectAll = (checked: boolean) => {
		if (checked) setSelectedMembers(new Set(members.map(({ id }) => id)));
		else setSelectedMembers(new Set());
	};

	const handleSelectMember = (memberId: string, checked: boolean) => {
		const newSelected = new Set(selectedMembers);
		if (checked) newSelected.add(memberId);
		else newSelected.delete(memberId);

		setSelectedMembers(newSelected);
	};

	const isAllSelected = selectedMembers.size === members.length && members.length > 0;

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

		const selectedMemberIds = Array.from(selectedMembers);
		console.log('제출 요청 대상 멤버 ID:', selectedMemberIds);

		toast.light('제출 요청이 전송되었어요.');
	};

	const handleStatusModalSave = () => {
		patchAssignmentStatus({
			submitStatus: selectedStatus.toUpperCase(),
			memberIds: Array.from(selectedMembers).map(Number),
		});
		setStatusModalOpen(false);
	};

	// 선택된 멤버들의 이름 목록
	const selectedMemberNames = members.filter((m) => selectedMembers.has(m.id)).map((m) => m.name);

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
					<ToggleButton label="내 팀만 보기" />
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
				tabs={[
					{ id: 'all', label: '전체' },
					{ id: 'team1', label: '1팀' },
					{ id: 'team2', label: '2팀' },
					{ id: 'team3', label: '3팀' },
				]}
				activeTabId={activeTeamTab}
				onTabChange={setActiveTeamTab}
				className="border-b-0"
			/>

			{/* 다중 액션 툴바 */}
			<MultiActionToolbar
				totalCount={members.length}
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
						{members.map((member) => {
							const { id, name, team, role, submitStatus } = member;
							return (
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
										<Input variant="line" placeholder="예) 100" className="h-10 w-full" />
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* 제출 상태 변경 모달 */}
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
