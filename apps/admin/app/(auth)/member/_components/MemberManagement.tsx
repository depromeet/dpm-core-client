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
	getApprovedMergeCandidatesQuery,
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
} from '../_lib/build-member-changes';
import {
	type ApprovalPlan,
	type ApprovedMergePair,
	duplicateKey,
	findDuplicatePartners,
	planApproval,
} from '../_lib/duplicate-pairs';
import { mapMemberRow } from '../_lib/map-member-row';
import type { MemberEditableField, MemberEditableFields, MemberRow } from '../_types';
import { ApprovedMemberTable } from './ApprovedMemberTable';
import { MemberApprovalTabs } from './MemberApprovalTabs';
import { MemberBulkEditBar } from './MemberBulkEditBar';
import { MemberBulkEditModal } from './MemberBulkEditModal';
import { MemberConfirmDialog } from './MemberConfirmDialog';
import { MemberFilterBar } from './MemberFilterBar';
import { MemberManagementHeader } from './MemberManagementHeader';
import { MemberMergeAccountDialog } from './MemberMergeAccountDialog';
import { MemberSelectionSummary } from './MemberSelectionSummary';
import { MemberSummaryBoard } from './MemberSummaryBoard';
import { PendingMemberTable } from './PendingMemberTable';

type DialogState =
	| { type: 'approve'; targets: MemberRow[]; plan: ApprovalPlan }
	| { type: 'reject'; targets: MemberRow[] }
	| { type: 'delete'; targets: MemberRow[] }
	| { type: 'merge-required'; hasOversizedGroup: boolean }
	| { type: 'merge-approved'; plan: ApprovalPlan }
	| { type: 'merge-conflict'; pairs: ApprovedMergePair[] }
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
			toast.success(plan.approvedPairs.length > 0 ? '병합을 완료했어요.' : '승인을 완료했어요.');
		},
		onError: (error, plan) => {
			// 병합은 쌍마다 따로 처리되므로, 중간에 실패해도 앞 쌍은 이미 끝났을 수 있다.
			refresh();
			// 서버는 같은 소셜의 서로 다른 계정이면 409 로 거절한다. 다른 회원의 계정으로 보고 안내한다.
			const status = (error as { response?: { status?: number } }).response?.status;
			if (status === 409 && plan.approvedPairs.length > 0) {
				setDialog({ type: 'merge-conflict', pairs: plan.approvedPairs });
				return;
			}
			toast.error('승인에 실패했어요. 잠시 후 다시 시도해 주세요.');
		},
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

	const [isCheckingMerge, setIsCheckingMerge] = useState(false);

	/**
	 * 짝이 선택되지 않은 중복 의심 계정마다 같은 사람의 승인된 계정을 찾는다.
	 * 모두 하나씩 찾으면 쌍으로 돌려주고, 하나라도 못 찾거나 상대를 하나로 좁히지 못하면 null.
	 */
	const findApprovedPairs = async (sources: MemberRow[]): Promise<ApprovedMergePair[] | null> => {
		const pairs: ApprovedMergePair[] = [];

		for (const source of sources) {
			const { data } = await queryClient.fetchQuery(
				getApprovedMergeCandidatesQuery(source.name.trim(), source.part),
			);
			const key = duplicateKey(source);
			const matches = data.members.map(mapMemberRow).filter((row) => duplicateKey(row) === key);

			// 같은 소셜 계정끼리는 병합할 수 없으니, 다른 소셜의 승인 계정이 있으면 그쪽을 병합 상대로 본다.
			const mergeable = matches.filter((row) => !isSameLoginMethod(source, row));
			const candidates = mergeable.length > 0 ? mergeable : matches;
			if (candidates.length !== 1) return null;

			pairs.push({ source, approved: candidates[0] });
		}

		return pairs;
	};

	const openApproveDialog = async (targets: MemberRow[]) => {
		if (targets.length === 0 || isCheckingMerge) return;

		const plan = planApproval(targets, rows);
		if (plan.unpaired.length === 0) {
			setDialog({ type: 'approve', targets, plan });
			return;
		}
		// 셋 이상이 함께 선택된 중복 의심 계정은 한 번에 병합할 수 없다.
		if (plan.hasOversizedGroup) {
			setDialog({ type: 'merge-required', hasOversizedGroup: true });
			return;
		}

		// 짝이 선택되지 않은 중복 의심 계정은 이미 승인된 같은 사람의 계정이 있는지 찾아 거기에 병합한다.
		setIsCheckingMerge(true);
		try {
			const approvedPairs = await findApprovedPairs(plan.unpaired);
			if (!approvedPairs) {
				setDialog({ type: 'merge-required', hasOversizedGroup: false });
				return;
			}
			if (approvedPairs.some(({ source, approved }) => isSameLoginMethod(source, approved))) {
				setDialog({ type: 'merge-conflict', pairs: approvedPairs });
				return;
			}

			setDialog({
				type: 'merge-approved',
				plan: {
					...plan,
					unpaired: [],
					approvedPairs,
					merges: [
						...plan.merges,
						...approvedPairs.map(({ source, approved }) => ({
							retainedMemberId: approved.id,
							sourceMemberId: source.id,
						})),
					],
				},
			});
		} catch {
			toast.error('승인된 계정을 확인하지 못했어요. 잠시 후 다시 시도해 주세요.');
		} finally {
			setIsCheckingMerge(false);
		}
	};

	/**
	 * 행 안의 승인 버튼. 그 행만 처리하면 중복 의심 계정은 짝이 빠져 항상 "병합 필요" 안내만 뜨므로
	 * - 체크한 계정이 여럿이고 이 행도 그중 하나면 체크한 계정 전체를 함께 처리하고
	 * - 아니면 중복 의심 계정은 짝이 정확히 하나일 때 짝과 함께 처리한다.
	 * (확인 모달에 대상 계정이 모두 표시되므로 어떤 계정이 처리되는지 확인할 수 있다.)
	 */
	const handleRowApprove = (row: MemberRow) => {
		if (selection.isSelected(row.id) && selectedRows.length > 1) {
			openApproveDialog(selectedRows);
			return;
		}
		if (row.duplicateSuspected) {
			const partners = findDuplicatePartners(row, rows);
			if (partners.length === 1) {
				openApproveDialog([row, partners[0]]);
				return;
			}
		}
		openApproveDialog([row]);
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
				closeDialog();
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
			closeDialog();
			refresh();
			toast.success('수정을 완료했어요.');
		},
		onError: () => toast.error('수정에 실패했어요. 잠시 후 다시 시도해 주세요.'),
	});

	/* --------------------------------- 렌더 --------------------------------- */

	const isPendingTab = filters.approvalStatus === 'PENDING';
	const showBulkEditBar = !isPendingTab && selectedRows.length > 0;
	// 중복 의심 계정만 골랐다면 승인 전에 병합이 일어나므로 버튼 문구로 미리 알린다.
	const isMergeOnlySelection =
		selectedRows.length > 0 && selectedRows.every((row) => row.duplicateSuspected);

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
				<div className="flex items-center gap-2">
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
								loading={isCheckingMerge}
								onClick={() => openApproveDialog(selectedRows)}
							>
								{isMergeOnlySelection ? '병합 후 승인하기' : '승인하기'}
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
							variant="secondary"
							className="disabled:opacity-20"
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
							onApprove={handleRowApprove}
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
				<div ref={loadMoreRef} className={showBulkEditBar ? 'h-28' : 'h-10'} />
				{isFetchingNextPage && (
					<p className="py-4 text-center font-medium text-body2 text-label-assistive">
						불러오는 중...
					</p>
				)}
			</div>

			{showBulkEditBar && (
				// 목록 길이와 상관없이 뷰포트 하단에 고정한다. 사이드바 너비만큼 비켜서 콘텐츠 영역 기준으로 배치한다.
				<div className="pointer-events-none fixed right-0 bottom-6 left-0 z-10 px-10 md:left-(--sidebar-width)">
					<MemberBulkEditBar
						selectedCount={selectedRows.length}
						currentValueOf={bulkEdit.currentValueOf}
						stagedFields={bulkEdit.stagedFields}
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

			<MemberMergeAccountDialog
				open={dialog?.type === 'merge-approved'}
				onOpenChange={closeDialog}
				variant="confirm"
				approvedAccounts={
					dialog?.type === 'merge-approved' ? dialog.plan.approvedPairs.map((p) => p.approved) : []
				}
				note={
					dialog?.type === 'merge-approved' &&
					(dialog.plan.approveIds.length > 0 ||
						dialog.plan.merges.length > dialog.plan.approvedPairs.length)
						? '함께 선택한 다른 계정도 이어서 승인돼요.'
						: undefined
				}
				isPending={isApproving}
				onConfirm={() => {
					if (dialog?.type !== 'merge-approved') return;
					runApproval(dialog.plan);
				}}
			/>

			<MemberMergeAccountDialog
				open={dialog?.type === 'merge-conflict'}
				onOpenChange={closeDialog}
				variant="conflict"
				approvedAccounts={
					dialog?.type === 'merge-conflict' ? dialog.pairs.map((pair) => pair.approved) : []
				}
				onConfirm={closeDialog}
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

/** 두 계정이 같은 소셜(카카오·애플)로 가입했는지. 같은 소셜의 다른 계정은 병합할 수 없다. */
function isSameLoginMethod(a: MemberRow, b: MemberRow) {
	return a.loginMethod !== null && a.loginMethod === b.loginMethod;
}

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
