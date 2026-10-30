'use client';

import { Pencil } from 'lucide-react';
import { Button, cn, TableCell, TableCheckbox, TableRow } from '@dpm-core/shared';

import {
	MEMBER_TYPE_LABEL,
	MEMBER_TYPE_ORDER,
	PART_LABEL,
	PART_ORDER,
	UNASSIGNED_TEAM_NUMBER,
} from '../_constants';
import type { MemberEditableField, MemberEditableFields, MemberRow } from '../_types';
import { InlineOptionSelect } from './InlineOptionSelect';
import { MemberActivityStatus } from './MemberActivityStatus';
import { MemberFieldChip, MemberPartChip } from './MemberFieldChip';
import { MemberLoginMethodIcon } from './MemberLoginMethodIcon';

const PART_OPTIONS = PART_ORDER.map((value) => ({ value, label: PART_LABEL[value] }));
const MEMBER_TYPE_OPTIONS = MEMBER_TYPE_ORDER.map((value) => ({
	value,
	label: MEMBER_TYPE_LABEL[value],
}));
const teamLabel = (teamNumber: number) =>
	teamNumber === UNASSIGNED_TEAM_NUMBER ? '미배정' : `${teamNumber}팀`;

interface ApprovedMemberRowProps {
	row: MemberRow;
	teamNumbers: number[];
	isSelected: boolean;
	onToggle: () => void;
	isEditing: boolean;
	draft: MemberEditableFields | null;
	onChange: <K extends MemberEditableField>(field: K, value: MemberEditableFields[K]) => void;
	onStartEdit: () => void;
	onCancel: () => void;
	onSave: () => void;
	isSaving: boolean;
}

export const ApprovedMemberRow = ({
	row,
	teamNumbers,
	isSelected,
	onToggle,
	isEditing,
	draft,
	onChange,
	onStartEdit,
	onCancel,
	onSave,
	isSaving,
}: ApprovedMemberRowProps) => {
	// 수정 중이면 아직 저장하지 않은 임시 값을, 아니면 서버 값을 그린다.
	const current: MemberEditableFields = isEditing && draft ? draft : row;

	const teamOptions = [
		{ value: UNASSIGNED_TEAM_NUMBER, label: '미배정' },
		...teamNumbers.map((number) => ({ value: number, label: `${number}팀` })),
	];

	return (
		<TableRow
			className={cn(
				'h-17.5 border-line-subtle hover:bg-background-strong/40',
				isSelected && 'bg-background-strong/60',
			)}
		>
			<TableCell className="w-12 px-3 [&:has([role=checkbox])]:pr-0">
				<TableCheckbox
					checked={isSelected}
					onCheckedChange={onToggle}
					aria-label={`${row.name} 선택`}
				/>
			</TableCell>

			<TableCell className="w-44 px-3">
				{isEditing ? (
					<InlineOptionSelect
						options={PART_OPTIONS}
						value={current.part}
						onChange={(value) => onChange('part', value)}
					>
						<MemberPartChip part={current.part} editable />
					</InlineOptionSelect>
				) : (
					<MemberPartChip part={row.part} />
				)}
			</TableCell>

			<TableCell data-clarity-mask="True" className="px-3">
				{/* 닉네임은 서버에서 수정하지 않는 값이라 수정 중에도 평소와 같은 모습으로 보여준다. */}
				<span className="block truncate font-semibold text-body1 text-label-normal">
					{row.name}
				</span>
			</TableCell>

			<TableCell
				data-clarity-mask="True"
				className="truncate px-3 font-medium text-body2 text-label-subtle"
			>
				<span className="flex items-center gap-1.5">
					<MemberLoginMethodIcon loginMethod={row.loginMethod} />
					<span className="truncate">{row.email ?? '-'}</span>
				</span>
			</TableCell>

			<TableCell className="w-36 px-3">
				{isEditing ? (
					<InlineOptionSelect
						options={MEMBER_TYPE_OPTIONS}
						value={current.memberType}
						onChange={(value) => onChange('memberType', value)}
					>
						<MemberFieldChip label={MEMBER_TYPE_LABEL[current.memberType]} editable />
					</InlineOptionSelect>
				) : (
					<MemberFieldChip label={MEMBER_TYPE_LABEL[row.memberType]} />
				)}
			</TableCell>

			<TableCell className="w-32 px-3">
				{isEditing ? (
					<InlineOptionSelect
						options={teamOptions}
						value={current.teamNumber}
						onChange={(value) => onChange('teamNumber', value)}
					>
						<MemberFieldChip label={teamLabel(current.teamNumber)} editable />
					</InlineOptionSelect>
				) : (
					<MemberFieldChip label={teamLabel(row.teamNumber)} />
				)}
			</TableCell>

			<TableCell className="w-48 px-3">
				{/* 활동 상태는 수정할 수 없어, 수정 중에도 화살표 없이 보여주기만 한다. */}
				<MemberActivityStatus status={row.activityStatus} />
			</TableCell>

			<TableCell className="w-28 px-3 text-right">
				{isEditing ? (
					<div className="flex items-center justify-end gap-1.5">
						<Button variant="assistive" size="sm" onClick={onCancel} disabled={isSaving}>
							취소
						</Button>
						<Button variant="primary" size="sm" onClick={onSave} loading={isSaving}>
							저장
						</Button>
					</div>
				) : (
					<button
						type="button"
						aria-label={`${row.name} 정보 수정`}
						onClick={onStartEdit}
						className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg bg-background-strong text-label-assistive transition-colors hover:bg-background-heavy"
					>
						<Pencil className="size-4" />
					</button>
				)}
			</TableCell>
		</TableRow>
	);
};
