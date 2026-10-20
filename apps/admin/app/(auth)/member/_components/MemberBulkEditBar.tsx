'use client';

import { Button, cn } from '@dpm-core/shared';

import {
	ACTIVITY_STATUS_LABEL,
	MEMBER_TYPE_LABEL,
	PART_LABEL,
	UNASSIGNED_TEAM_NUMBER,
} from '../_constants';
import type { MemberEditableField, MemberEditableFields } from '../_types';

const MIXED_LABEL = '혼합됨';

const FIELDS: Array<{ field: MemberEditableField; label: string }> = [
	{ field: 'memberType', label: '멤버 타입' },
	{ field: 'teamNumber', label: '팀' },
	{ field: 'part', label: '파트' },
	{ field: 'activityStatus', label: '활동 상태' },
];

function valueLabel<K extends MemberEditableField>(
	field: K,
	value: MemberEditableFields[K] | null,
): string {
	if (value === null || value === undefined) return MIXED_LABEL;

	switch (field) {
		case 'part':
			return PART_LABEL[value as MemberEditableFields['part']];
		case 'memberType':
			return MEMBER_TYPE_LABEL[value as MemberEditableFields['memberType']];
		case 'activityStatus':
			return ACTIVITY_STATUS_LABEL[value as MemberEditableFields['activityStatus']];
		case 'teamNumber':
			return value === UNASSIGNED_TEAM_NUMBER ? '미배정' : `${value}팀`;
		default:
			return MIXED_LABEL;
	}
}

/** Figma `icon-arrow-decrease-mono` (20px, 채워진 아래 화살표) */
const ArrowDecreaseIcon = ({ className }: { className?: string }) => (
	<svg
		aria-hidden
		className={className}
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M4.99026 7.63948C4.72486 7.63948 4.61871 7.95796 4.77794 8.17027L9.44889 13.7436C9.71429 14.062 10.192 14.062 10.4574 13.7436L15.2876 8.17027C15.4468 7.95796 15.2876 7.63948 15.0753 7.63948H4.99026Z"
			fill="currentColor"
			fillRule="evenodd"
			clipRule="evenodd"
		/>
	</svg>
);

interface MemberBulkEditBarProps {
	selectedCount: number;
	currentValueOf: <K extends MemberEditableField>(field: K) => MemberEditableFields[K] | null;
	stagedFields: MemberEditableField[];
	onOpenField: (field: MemberEditableField) => void;
	onSave: () => void;
	canSave: boolean;
	isSaving: boolean;
}

/** 여러 명을 고른 동안 화면 하단에 고정되어 떠 있는 일괄 수정 바. 위치는 부모 래퍼가 정한다. */
export const MemberBulkEditBar = ({
	selectedCount,
	currentValueOf,
	stagedFields,
	onOpenField,
	onSave,
	canSave,
	isSaving,
}: MemberBulkEditBarProps) => {
	return (
		<div className="pointer-events-auto flex items-center justify-between gap-4 overflow-clip rounded-[20px] bg-background-inverse px-6 py-4">
			<div className="flex shrink-0 items-center gap-2">
				<p className="font-bold text-label-inverse text-title1">정보 수정</p>
				<p className="flex items-center gap-1 text-body1">
					<span className="font-semibold text-primary-normal">{selectedCount}명</span>
					<span className="font-medium text-label-assistive">선택됨</span>
				</p>
			</div>

			<div className="flex items-center gap-3">
				{FIELDS.map(({ field, label }) => (
					<button
						key={field}
						type="button"
						onClick={() => onOpenField(field)}
						className={cn(
							'flex h-10 cursor-pointer items-center gap-2.5 rounded-lg border bg-[#303d50] px-4 font-medium text-body1 transition-opacity hover:opacity-80',
							stagedFields.includes(field) ? 'border-blue-400' : 'border-transparent',
						)}
					>
						<span className="flex items-center gap-2.5 text-label-assistive">
							{label}
							<span aria-hidden className="h-6.5 w-px bg-[#B5BBC8]/30" />
						</span>
						<span className="text-gray-0">{valueLabel(field, currentValueOf(field))}</span>
						<ArrowDecreaseIcon className="-ml-1.25 text-gray-0" />
					</button>
				))}
			</div>

			<Button
				variant="primary"
				size="md"
				className="shrink-0"
				disabled={!canSave}
				loading={isSaving}
				onClick={onSave}
			>
				저장하기
			</Button>
		</div>
	);
};
