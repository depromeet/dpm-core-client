'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
	Table,
	TableBody,
	TableCheckbox,
	TableHead,
	TableHeader,
	TableRow,
} from '@dpm-core/shared';

import { getCurrentCohortTeamsQuery } from '@/remotes/queries/cohort';

import type { MemberEditableField, MemberEditableFields, MemberRow } from '../_types';
import { ApprovedMemberRow } from './ApprovedMemberRow';
import { MemberEmptyView } from './MemberEmptyView';

interface ApprovedMemberTableProps {
	rows: MemberRow[];
	isSelected: (id: number) => boolean;
	isAllSelected: boolean;
	/** 더 불러올 페이지를 불러오는 동안 전체 선택 체크박스를 잠근다. */
	isTogglingAll?: boolean;
	onToggle: (id: number) => void;
	onToggleAll: () => void;
	editingId: number | null;
	draft: MemberEditableFields | null;
	onChange: <K extends MemberEditableField>(field: K, value: MemberEditableFields[K]) => void;
	onStartEdit: (row: MemberRow) => void;
	onCancelEdit: () => void;
	onSaveEdit: () => void;
	isSaving: boolean;
}

export const ApprovedMemberTable = ({
	rows,
	isSelected,
	isAllSelected,
	isTogglingAll = false,
	onToggle,
	onToggleAll,
	editingId,
	draft,
	onChange,
	onStartEdit,
	onCancelEdit,
	onSaveEdit,
	isSaving,
}: ApprovedMemberTableProps) => {
	const { data: teams } = useQuery(getCurrentCohortTeamsQuery);
	const teamNumbers = useMemo(() => (teams ?? []).map((team) => team.number), [teams]);

	if (rows.length === 0) return <MemberEmptyView />;

	return (
		<Table className="w-full table-fixed">
			<TableHeader>
				<TableRow className="h-10 border-0 bg-background-strong hover:bg-background-strong">
					<TableHead className="w-12 px-3 [&:has([role=checkbox])]:pr-0">
						<TableCheckbox
							checked={isAllSelected}
							disabled={isTogglingAll}
							onCheckedChange={onToggleAll}
							aria-label="전체 선택"
						/>
					</TableHead>
					<TableHead className="w-44 px-3 font-medium text-body2 text-label-subtle">파트</TableHead>
					<TableHead className="px-3 font-medium text-body2 text-label-subtle">이름</TableHead>
					<TableHead className="w-36 px-3 font-medium text-body2 text-label-subtle">
						멤버 타입
					</TableHead>
					<TableHead className="w-32 px-3 font-medium text-body2 text-label-subtle">팀</TableHead>
					<TableHead className="w-48 px-3 font-medium text-body2 text-label-subtle">
						활동 상태
					</TableHead>
					<TableHead className="w-28 px-3 text-right font-medium text-body2 text-label-subtle">
						수정
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows.map((row) => (
					<ApprovedMemberRow
						key={row.id}
						row={row}
						teamNumbers={teamNumbers}
						isSelected={isSelected(row.id)}
						onToggle={() => onToggle(row.id)}
						isEditing={editingId === row.id}
						draft={draft}
						onChange={onChange}
						onStartEdit={() => onStartEdit(row)}
						onCancel={onCancelEdit}
						onSave={onSaveEdit}
						isSaving={isSaving && editingId === row.id}
					/>
				))}
			</TableBody>
		</Table>
	);
};
