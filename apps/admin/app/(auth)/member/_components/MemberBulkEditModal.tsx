'use client';

import { useLayoutEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { OptionPickerModal, type SegmentedOption } from '@dpm-core/shared';

import { getCurrentCohortTeamsQuery } from '@/remotes/queries/cohort';

import {
	MEMBER_TYPE_LABEL,
	MEMBER_TYPE_ORDER,
	PART_ICON,
	UNASSIGNED_TEAM_NUMBER,
} from '../_constants';
import { toRealTeamNumbers } from '../_lib/team-options';
import type { MemberEditableField, MemberEditableFields, MemberRow } from '../_types';

const PART_PICKER_OPTIONS: SegmentedOption[] = [
	{ value: 'UNASSIGNED', label: '미배정' },
	{ value: 'DESIGN', label: '디자이너' },
	{ value: 'WEB', label: '웹' },
	{ value: 'SERVER', label: '서버' },
	{ value: 'IOS', label: 'IOS' },
	{ value: 'ANDROID', label: 'AOS' },
];

const FIELD_TITLE: Record<MemberEditableField, string> = {
	part: '파트 수정',
	teamNumber: '팀 수정',
	memberType: '멤버 타입 수정',
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
	useLayoutEffect(() => {
		if (field === null) return;

		function updateValue() {
			setValue(currentValue === null ? '' : String(currentValue));
		}
		updateValue();
	}, [field, currentValue]);

	const options = useMemo<SegmentedOption[]>(() => {
		switch (field) {
			case 'part':
				return PART_PICKER_OPTIONS;
			case 'memberType':
				return MEMBER_TYPE_ORDER.map((type) => ({ value: type, label: MEMBER_TYPE_LABEL[type] }));
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
	}, [field, teams]);

	const currentContent = field === null ? null : { field, subjects, options, value };
	const [lastOpenContent, setLastOpenContent] = useState<typeof currentContent>(null);

	// 닫힘 애니메이션 동안에는 마지막으로 보이던 선택지와 선택값을 유지한다.
	useLayoutEffect(() => {
		if (field === null) return;

		const openContent = { field, subjects, options, value };
		function rememberOpenContent() {
			setLastOpenContent(openContent);
		}
		rememberOpenContent();
	}, [field, subjects, options, value]);

	const content = currentContent ?? lastOpenContent;
	if (!content) return null;

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
				if (field !== null && !next) onClose();
			}}
			title={FIELD_TITLE[content.field]}
			description={
				<>
					다음 <span className="text-primary-normal">{content.subjects.length}명</span>의 계정 정보를
					변경합니다.
				</>
			}
			subjects={content.subjects.map(({ id, name, part }) => ({
				id,
				name,
				imageSrc: PART_ICON[part].src,
			}))}
			options={content.options}
			value={content.value}
			onChange={(next) => {
				if (field !== null) setValue(next);
			}}
			onConfirm={handleConfirm}
			confirmDisabled={!content.value}
		/>
	);
};
