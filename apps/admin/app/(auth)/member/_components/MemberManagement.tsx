'use client';

import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { MemberBadgeCard, MemberManagementUpdateRequest } from '@dpm-core/api';
import { Button, toast } from '@dpm-core/shared';

import { LoadingBox } from '@/components/loading-box';
import { usePreventPageExit } from '@/hooks/use-prevent-page-exit';
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
	| { type: 'merge-required'; hasOversizedGroup: boolean }
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
		isLoadingAllForSelection,
		loadAllAndGetIds,
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

	/**
	 * "전체 선택" 은 지금까지 불러온 행만으로는 부족하다. 더 불러올 페이지가 남아 있으면
	 * (예: 미승인 33명인데 30명만 로드된 상태) 먼저 나머지를 전부 불러온 뒤 선택해야,
	 * 체크박스가 "전체 선택됨"으로 보이는 동안 실제로는 일부만 선택된 상태를 막을 수 있다.
	 */
	const handleToggleAllSelection = useCallback(async () => {
		if (selection.isAllSelected) {
			selection.clear();
			return;
		}
		const allIds = await loadAllAndGetIds();
		selection.selectIds(allIds);
	}, [selection, loadAllAndGetIds]);

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
		// 탭 버튼과 마찬가지로 요약 카드도 탭·필터를 바꾸는 이동이다. 저장하지 않은
		// 인라인 수정이 있으면 먼저 확인을 받아야 한다 (안 그러면 탭 버튼에서만
		// 막히고 카드를 누르면 그대로 새 조건으로 넘어가 버린다).
		inlineEdit.guard(() => {
			applyBadgePreset(card);
			setSearchInput('');

			const target = badges?.cards.find((item) => item.card === card);
			if (badges && target?.hasNew) {
				acknowledgeBadge({ card, cohortId: badges.cohortId, version: target.version });
			}
		});
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
		// 중복 의심 계정은 정확히 짝(2명)을 함께 골라야 병합 후 승인할 수 있다.
		if (plan.unpaired.length > 0) {
			setDialog({ type: 'merge-required', hasOversizedGroup: plan.hasOversizedGroup });
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

	// 탭을 닫거나 브라우저 뒤로가기로 나가려 하면 네이티브 확인창으로 막는다.
	// (사이드바로 다른 메뉴 이동은 Next.js App Router 에 내비게이션을 가로채는 공식 방법이
	// 없어 범위에서 제외했다 — 멤버관리-개편.md 의 알려진 한계 참고)
	usePreventPageExit(inlineEdit.isDirty);

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

		const { changes, teamLookupFailed } = buildMemberChanges(editingRow, draft, teams ?? []);
		if (teamLookupFailed) {
			// 수정 상태는 유지해 사용자가 값을 그대로 두고 다시 저장을 시도할 수 있게 한다.
			toast.error('팀 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
			return;
		}
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
				{/*
				 * Figma 는 1440px 데스크톱 화면만 제공해 1024~1440px 사이 폭은 별도로 설계되지
				 * 않았다. 테이블 컬럼 너비(table-fixed)가 고정돼 있어 창이 좁아지면 전체 페이지가
				 * 깨지는 대신, 테이블만 가로 스크롤되도록 감싸 최소한의 안전장치를 둔다.
				 * (팝오버·드롭다운은 Portal 로 body 에 그려져 이 스크롤 영역에 잘리지 않는다.)
				 */}
				<div className="overflow-x-auto">
					{isLoading ? (
						<LoadingBox />
					) : isPendingTab ? (
						<PendingMemberTable
							rows={rows}
							isSelected={selection.isSelected}
							isAllSelected={selection.isAllSelected}
							isTogglingAll={isLoadingAllForSelection}
							onToggle={selection.toggle}
							onToggleAll={handleToggleAllSelection}
							onApprove={(row) => openApproveDialog([row])}
							onReject={(row) => setDialog({ type: 'reject', targets: [row] })}
						/>
					) : (
						<ApprovedMemberTable
							rows={rows}
							isSelected={selection.isSelected}
							isAllSelected={selection.isAllSelected}
							isTogglingAll={isLoadingAllForSelection}
							onToggle={selection.toggle}
							onToggleAll={handleToggleAllSelection}
							editingId={inlineEdit.editingId}
							draft={inlineEdit.draft}
							onChange={inlineEdit.change}
							onStartEdit={inlineEdit.start}
							onCancelEdit={inlineEdit.cancel}
							onSaveEdit={handleInlineSave}
							isSaving={isUpdating}
						/>
					)}
				</div>

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
				description={
					dialog?.type === 'merge-required' && dialog.hasOversizedGroup
						? '한 번에 최대 2개 계정까지만 병합할 수 있어요. 같은 사람으로 의심되는 계정을 2개씩 나눠서 선택해 주세요.'
						: '승인 전 병합이 필요한 계정은 병합할 계정 모두를 선택해주세요.'
				}
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
			// 조용히 건너뛰면 다른 컬럼은 저장되고 팀만 빠진 채 "수정 완료" 토스트가 뜨게 된다.
			// 이 요청 전체를 실패로 던져서 onError 가 처리하게 한다 (선택·임시값은 그대로 남는다).
			if (teamId === undefined) {
				throw new Error('팀 번호를 팀 ID 로 변환하지 못했습니다.');
			}
			return { teamId };
		}
		default:
			return null;
	}
}
