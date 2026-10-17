'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { OptionPickerModal, type SegmentedOption, type SubjectChip } from '@dpm-core/shared';

import { getCurrentCohortTeamsQuery } from '@/remotes/queries/cohort';

import {
	ACTIVITY_STATUS_LABEL,
	ACTIVITY_STATUS_ORDER,
	MEMBER_TYPE_LABEL,
	MEMBER_TYPE_ORDER,
	PART_LABEL,
	PART_ORDER,
	UNASSIGNED_TEAM_NUMBER,
} from '../_constants';
import type { MemberEditableField, MemberEditableFields } from '../_types';

const FIELD_TITLE: Record<MemberEditableField, string> = {
	part: '파트 수정',
	teamNumber: '팀 수정',
	memberType: '멤버 타입 수정',
	activityStatus: '활동 상태 수정',
};

interface MemberBulkEditModalProps {
	field: MemberEditableField | null;
	subjects: SubjectChip[];
	/** 선택한 멤버들의 현재 공통값. 섞여 있으면 null */
	currentValue: string | number | null;
	onClose: () => void;
	onConfirm: <K extends MemberEditableField>(field: K, value: MemberEditableFields[K]) => void;
}

/** 고른 컬럼에 맞는 선택지를 꺼내 범용 선택 모달에 넘겨준다. */
export const MemberBulkEditModal = ({
	field,
	subjects,
	currentValue,
	onClose,
	onConfirm,
}: MemberBulkEditModalProps) => {
	const { data: teams } = useQuery(getCurrentCohortTeamsQuery);
	const [value, setValue] = useState('');

	// 모달을 다시 열 때마다 현재 공통값에서 시작한다.
	useEffect(() => {
		setValue(currentValue === null ? '' : String(currentValue));
	}, [currentValue]);

	/**
	 * field 가 null 이 되는 순간 바로 return null 해버리면 Dialog 전체가 React 트리에서
	 * 사라져 Radix 의 닫힘 애니메이션이 재생될 틈이 없다. 그래서 실제로 보여줄 필드는
	 * "마지막으로 열렸던 필드" 를 기억해두고, Dialog 는 open={field !== null} 로만 닫는다.
	 */
	const lastFieldRef = useRef<MemberEditableField | null>(null);
	if (field) lastFieldRef.current = field;
	const displayField = field ?? lastFieldRef.current;

	const options = useMemo<SegmentedOption[]>(() => {
		switch (displayField) {
			case 'part':
				return PART_ORDER.map((part) => ({ value: part, label: PART_LABEL[part] }));
			case 'memberType':
				return MEMBER_TYPE_ORDER.map((type) => ({ value: type, label: MEMBER_TYPE_LABEL[type] }));
			case 'activityStatus':
				return ACTIVITY_STATUS_ORDER.map((status) => ({
					value: status,
					label: ACTIVITY_STATUS_LABEL[status],
					// 수료 위험은 서버가 계산하는 값이라 일괄로 바꿀 수 없다.
					disabled: status === 'AT_RISK',
					disabledReason: status === 'AT_RISK' ? '출석 데이터로 자동 계산돼요' : undefined,
				}));
			case 'teamNumber':
				return [
					{ value: String(UNASSIGNED_TEAM_NUMBER), label: '미배정' },
					...(teams ?? []).map((team) => ({
						value: String(team.number),
						label: `${team.number}팀`,
					})),
				];
			default:
				return [];
		}
	}, [displayField, teams]);

	if (!displayField) return null;

	const handleConfirm = () => {
		if (!value || !field) return;
		if (field === 'teamNumber') onConfirm('teamNumber', Number(value));
		else onConfirm(field, value as never);
	};

	return (
		<OptionPickerModal
			open={field !== null}
			onOpenChange={(next) => {
				if (!next) onClose();
			}}
			title={FIELD_TITLE[displayField]}
			description={
				<>
					다음 <span className="text-primary-normal">{subjects.length}명</span>의 계정 정보를
					변경합니다.
				</>
			}
			subjects={subjects}
			options={options}
			value={value}
			onChange={setValue}
			onConfirm={handleConfirm}
			confirmDisabled={!value}
		/>
	);
};
