'use client';

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import type { ManagedMemberPart } from '@dpm-core/api';
import { cn } from '@dpm-core/shared';

import { PART_ICON, PART_LABEL } from '../_constants';

interface MemberFieldChipProps {
	label: string;
	/** 수정 중인 행에서만 화살표를 띄우고 클릭을 받는다. */
	editable?: boolean;
	onClick?: () => void;
	className?: string;
}

/** 테이블 셀에 값 하나를 보여주는 작은 칩. 수정 중이면 드롭다운 트리거가 된다. */
export const MemberFieldChip = ({
	label,
	editable = false,
	onClick,
	className,
}: MemberFieldChipProps) => {
	const content = (
		<>
			<span className="truncate">{label}</span>
			{editable && <ChevronDown className="size-4 shrink-0 text-label-assistive" />}
		</>
	);

	const chipClassName = cn(
		'inline-flex h-8 items-center gap-1 rounded-lg border border-line-normal px-3 font-medium text-body2 text-label-subtle',
		editable && 'cursor-pointer hover:border-line-subtle hover:bg-background-strong',
		className,
	);

	if (!editable) return <span className={chipClassName}>{content}</span>;

	return (
		<button type="button" className={chipClassName} onClick={onClick}>
			{content}
		</button>
	);
};

/** 파트는 아이콘과 이름을 함께 보여준다. */
export const MemberPartChip = ({
	part,
	editable,
	onClick,
}: {
	part: ManagedMemberPart;
	editable?: boolean;
	onClick?: () => void;
}) => {
	return (
		<div className="flex items-center gap-2">
			<Image src={PART_ICON[part]} alt="" width={28} height={28} className="size-7 shrink-0" />
			<MemberFieldChip
				label={part === 'UNASSIGNED' ? '미입력' : PART_LABEL[part]}
				editable={editable}
				onClick={onClick}
			/>
		</div>
	);
};
