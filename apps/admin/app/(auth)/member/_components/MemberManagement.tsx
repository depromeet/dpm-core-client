'use client';

import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { MemberBadgeCard, MemberManagementUpdateRequest } from '@dpm-core/api';
import { Button, toast } from '@dpm-core/shared';

import { LoadingBox } from '@/components/loading-box';
import { useDebounce } from '@/hooks/useDebounce';
import {
	acknowledgeMemberBadgeMutationOptions,
	approveMembersMutationOptions,
	bulkDeleteMembersMutationOptions,
	bulkUpdateManagedMembersMutationOptions,
	mergeMembersMutationOptions,
	rejectMemberMutationOptions,
	updateManagedMemberMutationOptions,
} from '@/remotes/mutations/member';
import { getCurrentCohortQuery, getCurrentCohortTeamsQuery } from '@/remotes/queries/cohort';
import {
	getMemberBadgesQuery,
	MEMBER_BADGES_QUERY_KEY,
	MEMBER_MANAGEMENT_QUERY_KEY,
} from '@/remotes/queries/member';

import { useBulkMemberEdit } from '../_hooks/useBulkMemberEdit';
import { useInlineMemberEdit } from '../_hooks/useInlineMemberEdit';
import { useMemberFilters } from '../_hooks/useMemberFilters';
import { useMemberList } from '../_hooks/useMemberList';
import { useMemberSelection } from '../_hooks/useMemberSelection';
import {
	buildMemberChanges,
	hasChanges,
	toTeamId,
	toUpdatableStatus,
} from '../_lib/build-member-changes';
import { type ApprovalPlan, planApproval } from '../_lib/duplicate-pairs';
import type { MemberEditableField, MemberEditableFields, MemberRow } from '../_types';
import { ApprovedMemberTable } from './ApprovedMemberTable';
import { MemberApprovalTabs } from './MemberApprovalTabs';
import { MemberBulkEditBar } from './MemberBulkEditBar';
import { MemberBulkEditModal } from './MemberBulkEditModal';
import { MemberConfirmDialog } from './MemberConfirmDialog';
import { MemberFilterBar } from './MemberFilterBar';
import { MemberManagementHeader } from './MemberManagementHeader';
import { MemberSelectionSummary } from './MemberSelectionSummary';
import { MemberSummaryBoard } from './MemberSummaryBoard';
import { PendingMemberTable } from './PendingMemberTable';

type DialogState =
	| { type: 'approve'; targets: MemberRow[]; plan: ApprovalPlan }
	| { type: 'reject'; targets: MemberRow[] }
	| { type: 'delete'; targets: MemberRow[] }
	| { type: 'merge-required' }
	| null;

/** 멤버 관리 화면의 조립 지점. 훅에서 받은 상태를 각 UI 조각에 나눠준다. */
export const MemberManagement = () => {
	const queryClient = useQueryClient();
	const {
		filters,
		queryParams,
		setApprovalStatus,
		setSearch,
		setParts,
		setTeamNumbers,
		setActivityStatuses,
		setExcludeStaff,
		applyBadgePreset,
	} = useMemberFilters();

	const [searchInput, setSearchInput] = useState('');
	const debouncedSetSearch = useDebounce(setSearch, 300);

	const {
		rows,
		summary,
		totalElements,
		lastUpdatedAt,
		isLoading,
		loadMoreRef,
		isFetchingNextPage,
	} = useMemberList(queryParams);

	const { data: cohortNumber } = useQuery(getCurrentCohortQuery);
	const { data: teams } = useQuery(getCurrentCohortTeamsQuery);
	const { data: badges } = useQuery(getMemberBadgesQuery);

	const visibleIds = useMemo(() => rows.map((row) => row.id), [rows]);
	const selection = useMemberSelection(visibleIds, queryParams);
	const selectedRows = useMemo(
		() => rows.filter((row) => selection.selectedIds.has(row.id)),
		[rows, selection.selectedIds],
	);

	const [dialog, setDialog] = useState<DialogState>(null);
	const closeDialog = useCallback(() => setDialog(null), []);

	const refresh = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: MEMBER_MANAGEMENT_QUERY_KEY });
		queryClient.invalidateQueries({ queryKey: MEMBER_BADGES_QUERY_KEY });
	}, [queryClient]);

	/* ------------------------------- 요약 카드 ------------------------------- */

	const newBadgeCards = useMemo(
		() => new Set((badges?.cards ?? []).filter((card) => card.hasNew).map((card) => card.card)),
		[badges],
	);

	const { mutate: acknowledgeBadge } = useMutation(
		acknowledgeMemberBadgeMutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: MEMBER_BADGES_QUERY_KEY }),
		}),
	);

	const handleSelectCard = (card: MemberBadgeCard) => {
		applyBadgePreset(card);
		setSearchInput('');

		const target = badges?.cards.find((item) => item.card === card);
		if (badges && target?.hasNew) {
			acknowledgeBadge({ card, cohortId: badges.cohortId, version: target.version });
		}
	};

	/* -------------------------------- 승인·병합 ------------------------------- */

	const { mutateAsync: approveMembers } = useMutation(approveMembersMutationOptions());
	const { mutateAsync: mergeMembers } = useMutation(mergeMembersMutationOptions());
	const { mutateAsync: rejectMember } = useMutation(rejectMemberMutationOptions());

	const { mutate: runApproval, isPending: isApproving } = useMutation({
		mutationFn: async (plan: ApprovalPlan) => {
			// 병합은 계정을 정리한 뒤 승인까지 끝내므로 일반 승인보다 먼저 처리한다.
			for (const merge of plan.merges) await mergeMembers(merge);
			if (plan.approveIds.length > 0) await approveMembers({ members: plan.approveIds });
		},
		onSuccess: (_data, plan) => {
			selection.deselect([
				...plan.approveIds,
				...plan.merges.flatMap((merge) => [merge.retainedMemberId, merge.sourceMemberId]),
			]);
			closeDialog();
			refresh();
			toast.success('승인을 완료했어요.');
		},
		onError: () => toast.error('승인에 실패했어요. 잠시 후 다시 시도해 주세요.'),
	});

	const { mutate: runRejection, isPending: isRejecting } = useMutation({
		mutationFn: async (targets: MemberRow[]) => {
			for (const target of targets) await rejectMember(target.id);
		},
		onSuccess: (_data, targets) => {
			selection.deselect(targets.map((target) => target.id));
			closeDialog();
			refresh();
			toast.success('가입을 반려했어요.');
		},
		onError: () => toast.error('반려에 실패했어요. 잠시 후 다시 시도해 주세요.'),
	});

	const openApproveDialog = (targets: MemberRow[]) => {
		if (targets.length === 0) return;

		const plan = planApproval(targets, rows);
		// 중복 의심 계정은 짝을 함께 골라야 병합 후 승인할 수 있다.
		if (plan.unpaired.length > 0) {
			setDialog({ type: 'merge-required' });
			return;
		}
		setDialog({ type: 'approve', targets, plan });
	};

	/* --------------------------------- 삭제 --------------------------------- */

	const { mutate: deleteMembers, isPending: isDeleting } = useMutation(
		bulkDeleteMembersMutationOptions({
			onSuccess: (_data, variables) => {
				selection.deselect(variables.memberIds);
				closeDialog();
				refresh();
				toast.success('삭제를 완료했어요.');
			},
			onError: () => toast.error('삭제에 실패했어요. 잠시 후 다시 시도해 주세요.'),
		}),
	);

	/* ------------------------------- 개별 수정 ------------------------------- */

	const inlineEdit = useInlineMemberEdit();
	const closeInlineEdit = inlineEdit.close;

	const { mutate: updateMember, isPending: isUpdating } = useMutation(
		updateManagedMemberMutationOptions({
			onSuccess: () => {
				closeInlineEdit();
				refresh();
				toast.success('수정을 완료했어요.');
			},
			onError: () => toast.error('수정에 실패했어요. 잠시 후 다시 시도해 주세요.'),
		}),
	);

	const handleInlineSave = useCallback(() => {
		const { editingRow, draft } = inlineEdit;
		if (!editingRow || !draft) return;

		const changes = buildMemberChanges(editingRow, draft, teams ?? []);
		// 아무것도 바뀌지 않았으면 요청 없이 수정 상태만 닫는다.
		if (!hasChanges(changes)) {
			inlineEdit.close();
			return;
		}
		updateMember({ memberId: editingRow.id, changes });
	}, [inlineEdit, teams, updateMember]);

	/* ------------------------------- 일괄 수정 ------------------------------- */

	const bulkEdit = useBulkMemberEdit(selectedRows);

	const { mutateAsync: bulkUpdateMembers } = useMutation(bulkUpdateManagedMembersMutationOptions());

	const { mutate: saveBulkEdit, isPending: isBulkSaving } = useMutation({
		mutationFn: async () => {
			const memberIds = selection.selectedIdList;

			// 서버는 한 번에 한 컬럼만 받으므로 고친 컬럼 수만큼 나눠 보낸다.
			for (const field of bulkEdit.stagedFields) {
				const changes = toBulkChanges(field, bulkEdit.draft, teams ?? []);
				if (changes) await bulkUpdateMembers({ memberIds, changes });
			}
		},
		onSuccess: () => {
			bulkEdit.reset();
			selection.clear();
			refresh();
			toast.success('수정을 완료했어요.');
		},
		onError: () => toast.error('수정에 실패했어요. 잠시 후 다시 시도해 주세요.'),
	});

	/* --------------------------------- 렌더 --------------------------------- */

	const isPendingTab = filters.approvalStatus === 'PENDING';
	const showBulkEditBar = !isPendingTab && selectedRows.length > 0;

	return (
		<div className="flex w-full flex-col bg-background-normal pb-10">
			<MemberManagementHeader
				totalMemberCount={summary.totalMemberCount}
				lastUpdatedAt={lastUpdatedAt}
				search={searchInput}
				onSearchChange={(value) => {
					setSearchInput(value);
					debouncedSetSearch(value);
				}}
			/>

			<div className="px-10 pt-4">
				<MemberSummaryBoard
					cohortNumber={cohortNumber}
					summary={summary}
					newBadgeCards={newBadgeCards}
					onSelectCard={handleSelectCard}
				/>
			</div>

			<div className="px-10 pt-6">
				<MemberApprovalTabs
					value={filters.approvalStatus}
					// 저장하지 않은 수정이 있으면 확인을 받고 탭을 옮긴다.
					onChange={(next) => inlineEdit.guard(() => setApprovalStatus(next))}
				/>
			</div>

			<div className="flex items-center justify-between gap-4 px-10 py-3">
				<div className="flex items-center gap-4">
					{!isPendingTab && (
						<MemberFilterBar
							parts={filters.parts}
							teamNumbers={filters.teamNumbers}
							activityStatuses={filters.activityStatuses}
							excludeStaff={filters.excludeStaff}
							onPartsChange={setParts}
							onTeamNumbersChange={setTeamNumbers}
							onActivityStatusesChange={setActivityStatuses}
							onExcludeStaffChange={setExcludeStaff}
						/>
					)}
					<MemberSelectionSummary
						selectedCount={selectedRows.length}
						totalCount={totalElements}
						onClear={selection.clear}
					/>
				</div>

				<div className="flex items-center gap-2">
					{isPendingTab ? (
						<>
							<Button
								variant="secondary"
								size="md"
								disabled={selectedRows.length === 0}
								onClick={() => openApproveDialog(selectedRows)}
							>
								승인하기
							</Button>
							<Button
								variant="assistive"
								size="md"
								disabled={selectedRows.length === 0}
								onClick={() => setDialog({ type: 'reject', targets: selectedRows })}
							>
								반려하기
							</Button>
						</>
					) : (
						<Button
							variant="assistive"
							size="md"
							disabled={selectedRows.length === 0}
							onClick={() => setDialog({ type: 'delete', targets: selectedRows })}
						>
							삭제하기
						</Button>
					)}
				</div>
			</div>

			<div className="px-10">
				{isLoading ? (
					<LoadingBox />
				) : isPendingTab ? (
					<PendingMemberTable
						rows={rows}
						isSelected={selection.isSelected}
						isAllSelected={selection.isAllSelected}
						onToggle={selection.toggle}
						onToggleAll={selection.toggleAll}
						onApprove={(row) => openApproveDialog([row])}
						onReject={(row) => setDialog({ type: 'reject', targets: [row] })}
					/>
				) : (
					<ApprovedMemberTable
						rows={rows}
						isSelected={selection.isSelected}
						isAllSelected={selection.isAllSelected}
						onToggle={selection.toggle}
						onToggleAll={selection.toggleAll}
						editingId={inlineEdit.editingId}
						draft={inlineEdit.draft}
						onChange={inlineEdit.change}
						onStartEdit={inlineEdit.start}
						onCancelEdit={inlineEdit.cancel}
						onSaveEdit={handleInlineSave}
						isSaving={isUpdating}
					/>
				)}

				{/* 끝에 닿으면 다음 페이지를 불러온다. */}
				<div ref={loadMoreRef} className="h-10" />
				{isFetchingNextPage && (
					<p className="py-4 text-center font-medium text-body2 text-label-assistive">
						불러오는 중...
					</p>
				)}
			</div>

			{showBulkEditBar && (
				<div className="px-10">
					<MemberBulkEditBar
						selectedCount={selectedRows.length}
						currentValueOf={bulkEdit.currentValueOf}
						onOpenField={bulkEdit.openModal}
						onSave={() => saveBulkEdit()}
						canSave={bulkEdit.hasChanges}
						isSaving={isBulkSaving}
					/>
				</div>
			)}

			<MemberBulkEditModal
				field={bulkEdit.openField}
				subjects={selectedRows}
				currentValue={bulkEdit.openField ? bulkEdit.currentValueOf(bulkEdit.openField) : null}
				onClose={bulkEdit.closeModal}
				onConfirm={bulkEdit.stage}
			/>

			<MemberConfirmDialog
				open={dialog?.type === 'approve'}
				onOpenChange={closeDialog}
				title="가입 승인"
				description={
					<>
						해당 계정{' '}
						<span className="text-primary-normal">
							{dialog?.type === 'approve' ? dialog.targets.length : 0}개
						</span>
						를 승인할까요? 병합이 필요한 계정은 병합 후 승인됩니다.
					</>
				}
				subjects={dialog?.type === 'approve' ? dialog.targets : []}
				isPending={isApproving}
				actions={[
					{
						label: '반려하기',
						onClick: () => {
							if (dialog?.type !== 'approve') return;
							setDialog({ type: 'reject', targets: dialog.targets });
						},
					},
					{
						label: '승인하기',
						onClick: () => {
							if (dialog?.type !== 'approve') return;
							runApproval(dialog.plan);
						},
					},
				]}
			/>

			<MemberConfirmDialog
				open={dialog?.type === 'reject'}
				onOpenChange={closeDialog}
				title="가입 반려"
				description={
					<>
						해당 계정{' '}
						<span className="text-primary-normal">
							{dialog?.type === 'reject' ? dialog.targets.length : 0}개
						</span>
						의 가입을 반려합니다. 반려된 계정은 표에서 삭제됩니다.
					</>
				}
				subjects={dialog?.type === 'reject' ? dialog.targets : []}
				isPending={isRejecting}
				actions={[
					{ label: '취소', onClick: closeDialog },
					{
						label: '반려하기',
						onClick: () => {
							if (dialog?.type !== 'reject') return;
							runRejection(dialog.targets);
						},
					},
				]}
			/>

			<MemberConfirmDialog
				open={dialog?.type === 'delete'}
				onOpenChange={closeDialog}
				title="멤버 삭제"
				description={
					<>
						해당 멤버{' '}
						<span className="text-primary-normal">
							{dialog?.type === 'delete' ? dialog.targets.length : 0}명
						</span>
						을 삭제합니다. 삭제된 멤버는 표에서 사라집니다.
					</>
				}
				subjects={dialog?.type === 'delete' ? dialog.targets : []}
				isPending={isDeleting}
				actions={[
					{ label: '취소', onClick: closeDialog },
					{
						label: '삭제하기',
						onClick: () => {
							if (dialog?.type !== 'delete') return;
							deleteMembers({ memberIds: dialog.targets.map((target) => target.id) });
						},
					},
				]}
			/>

			<MemberConfirmDialog
				open={dialog?.type === 'merge-required'}
				onOpenChange={closeDialog}
				title="승인 전 계정 병합 필요"
				description="승인 전 병합이 필요한 계정은 병합할 계정 모두를 선택해주세요."
				actions={[{ label: '확인', onClick: closeDialog }]}
			/>

			<MemberConfirmDialog
				open={inlineEdit.exitGuard.open}
				onOpenChange={(open) => {
					if (!open) inlineEdit.exitGuard.dismiss();
				}}
				title="저장되지 않은 정보"
				description="저장하지 않은 수정 내용이 있어요. 저장하지 않고 나가면 변경한 내용이 사라집니다."
				actions={[
					{ label: '계속 수정하기', onClick: inlineEdit.exitGuard.dismiss },
					{ label: '나가기', onClick: inlineEdit.exitGuard.confirm },
				]}
			/>
		</div>
	);
};

/** 일괄 수정은 한 요청에 한 컬럼만 담는다. */
function toBulkChanges(
	field: MemberEditableField,
	draft: Partial<MemberEditableFields>,
	teams: Parameters<typeof toTeamId>[1],
): MemberManagementUpdateRequest | null {
	switch (field) {
		case 'part':
			return draft.part ? { part: draft.part } : null;
		case 'memberType':
			return draft.memberType ? { memberType: draft.memberType } : null;
		case 'activityStatus':
			return draft.activityStatus ? { status: toUpdatableStatus(draft.activityStatus) } : null;
		case 'teamNumber': {
			if (draft.teamNumber === undefined) return null;
			const teamId = toTeamId(draft.teamNumber, teams);
			return teamId === undefined ? null : { teamId };
		}
		default:
			return null;
	}
}
