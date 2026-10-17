'use client';

import { ChevronDown } from 'lucide-react';
import { Button } from '@dpm-core/shared';

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

interface MemberBulkEditBarProps {
	selectedCount: number;
	currentValueOf: <K extends MemberEditableField>(field: K) => MemberEditableFields[K] | null;
	onOpenField: (field: MemberEditableField) => void;
	onSave: () => void;
	canSave: boolean;
	isSaving: boolean;
}

/** 여러 명을 고른 동안 테이블 아래에 떠 있는 일괄 수정 바. */
export const MemberBulkEditBar = ({
	selectedCount,
	currentValueOf,
	onOpenField,
	onSave,
	canSave,
	isSaving,
}: MemberBulkEditBarProps) => {
	return (
		<div className="sticky bottom-6 z-10 flex items-center gap-4 rounded-xl bg-background-inverse px-6 py-4 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.16)]">
			<p className="shrink-0 font-bold text-body1 text-label-inverse">
				정보 수정 <span className="text-primary-light">{selectedCount}명</span> 선택됨
			</p>

			<div className="flex flex-1 flex-wrap items-center gap-2">
				{FIELDS.map(({ field, label }) => (
					<button
						key={field}
						type="button"
						onClick={() => onOpenField(field)}
						className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-gray-700 px-3 transition-colors hover:bg-gray-700"
					>
						<span className="font-medium text-body2 text-label-assistive">{label}</span>
						<span className="font-semibold text-body2 text-label-inverse">
							{valueLabel(field, currentValueOf(field))}
						</span>
						<ChevronDown className="size-4 text-label-inverse" />
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
