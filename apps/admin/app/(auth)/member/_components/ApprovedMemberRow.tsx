'use client';

import { Pencil } from 'lucide-react';
import { Button, cn, TableCell, TableCheckbox, TableRow } from '@dpm-core/shared';

import {
	ACTIVITY_STATUS_LABEL,
	ACTIVITY_STATUS_ORDER,
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

const PART_OPTIONS = PART_ORDER.map((value) => ({ value, label: PART_LABEL[value] }));
const MEMBER_TYPE_OPTIONS = MEMBER_TYPE_ORDER.map((value) => ({
	value,
	label: MEMBER_TYPE_LABEL[value],
}));
/** 수료 위험은 서버가 계산하므로 직접 고를 수 없다. */
const ACTIVITY_STATUS_OPTIONS = ACTIVITY_STATUS_ORDER.map((value) => ({
	value,
	label: ACTIVITY_STATUS_LABEL[value],
	disabled: value === 'AT_RISK',
	disabledReason: value === 'AT_RISK' ? '출석 데이터로 자동 계산돼요' : undefined,
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
		<TableRow className={cn('h-17.5 border-line-subtle', isSelected && 'bg-background-strong/60')}>
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

			<TableCell className="px-3">
				{/* 닉네임은 서버에서 수정하지 않는 값이라 읽기 전용으로만 보여준다. */}
				<span
					className={cn(
						'block truncate font-semibold text-body1 text-label-normal',
						isEditing && 'rounded-lg bg-background-strong px-3 py-2 text-label-assistive',
					)}
				>
					{row.name}
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
				{isEditing ? (
					<InlineOptionSelect
						options={ACTIVITY_STATUS_OPTIONS}
						value={current.activityStatus}
						onChange={(value) => onChange('activityStatus', value)}
					>
						<MemberActivityStatus status={current.activityStatus} editable />
					</InlineOptionSelect>
				) : (
					<MemberActivityStatus status={row.activityStatus} />
				)}
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
