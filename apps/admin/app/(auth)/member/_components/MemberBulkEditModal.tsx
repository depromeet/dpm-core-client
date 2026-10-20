'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { OptionPickerModal, type SegmentedOption } from '@dpm-core/shared';

import { getCurrentCohortTeamsQuery } from '@/remotes/queries/cohort';

import {
	ACTIVITY_STATUS_LABEL,
	ACTIVITY_STATUS_ORDER,
	MEMBER_TYPE_LABEL,
	MEMBER_TYPE_ORDER,
	PART_ICON,
	UNASSIGNED_TEAM_NUMBER,
} from '../_constants';
import { toRealTeamNumbers } from '../_lib/team-options';
import type { MemberEditableField, MemberEditableFields, MemberRow } from '../_types';

/** 파트 수정 모달은 Figma 기준으로 영문 라벨과 이 순서로 노출한다. (표·필터의 한글 라벨과 다르다.) */
const PART_PICKER_OPTIONS: SegmentedOption[] = [
	{ value: 'UNASSIGNED', label: '미배정' },
	{ value: 'DESIGN', label: 'DESIGN' },
	{ value: 'WEB', label: 'WEB' },
	{ value: 'SERVER', label: 'SERVER' },
	{ value: 'IOS', label: 'IOS' },
	{ value: 'ANDROID', label: 'ANDROID' },
];

const FIELD_TITLE: Record<MemberEditableField, string> = {
	part: '파트 수정',
	teamNumber: '팀 수정',
	memberType: '멤버 타입 수정',
	activityStatus: '활동 상태 수정',
};

interface MemberBulkEditModalProps {
	field: MemberEditableField | null;
	subjects: MemberRow[];
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
				return PART_PICKER_OPTIONS;
			case 'memberType':
				return MEMBER_TYPE_ORDER.map((type) => ({ value: type, label: MEMBER_TYPE_LABEL[type] }));
			case 'activityStatus': {
				// 선택한 대상 중 이미 활동 정지된 멤버가 있으면, 이번 기수에서 되돌릴 수 없으므로
				// "활동 중"으로 일괄 변경하는 선택지 자체를 막는다.
				const hasInactiveSubject = subjects.some(
					(subject) => subject.activityStatus === 'INACTIVE',
				);
				return ACTIVITY_STATUS_ORDER.map((status) => {
					if (status === 'AT_RISK') {
						// 수료 위험은 서버가 계산하는 값이라 일괄로 바꿀 수 없다.
						return {
							value: status,
							label: ACTIVITY_STATUS_LABEL[status],
							disabled: true,
							disabledReason: '출석 데이터로 자동 계산돼요',
						};
					}
					if (status === 'NORMAL' && hasInactiveSubject) {
						return {
							value: status,
							label: ACTIVITY_STATUS_LABEL[status],
							disabled: true,
							disabledReason: '이미 활동 정지된 계정이 포함돼 있어요',
						};
					}
					return { value: status, label: ACTIVITY_STATUS_LABEL[status] };
				});
			}
			case 'teamNumber':
				return [
					{ value: String(UNASSIGNED_TEAM_NUMBER), label: '미배정' },
					...toRealTeamNumbers(teams ?? []).map((number) => ({
						value: String(number),
						label: `${number}팀`,
					})),
				];
			default:
				return [];
		}
	}, [displayField, teams, subjects]);

	if (!displayField) return null;

	const handleConfirm = () => {
		if (!value || !field) return;

		// 공통값에서 아무것도 바꾸지 않고 확인을 눌렀다면 변경된 것으로 표시하지 않는다.
		const isUnchanged = currentValue !== null && String(currentValue) === value;
		if (isUnchanged) {
			onClose();
			return;
		}

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
			subjects={subjects.map(({ id, name, part }) => ({
				id,
				name,
				imageSrc: PART_ICON[part].src,
			}))}
			options={options}
			value={value}
			onChange={setValue}
			onConfirm={handleConfirm}
			confirmDisabled={!value}
		/>
	);
};
