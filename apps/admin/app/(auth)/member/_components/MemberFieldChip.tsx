'use client';

import Image from 'next/image';
import { forwardRef } from 'react';
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

/**
 * 테이블 셀에 값 하나를 보여주는 작은 칩. 수정 중이면 드롭다운 트리거가 된다.
 *
 * InlineOptionSelect 의 PopoverTrigger asChild 로 그대로 쓰이기 때문에 ref 를
 * 반드시 실제 DOM 요소까지 전달해야 한다. 그러지 않으면 Radix 가 트리거 위치를
 * 잴 수 없어 드롭다운이 화면 밖(예: y=-500 같은 값)에 그려진다 — 타입 에러도,
 * 콘솔 경고도 없이 조용히 깨지기 때문에 실제로 열어보기 전까지는 알아채기 어렵다.
 * (asChild 가 주입하는 onClick 외 다른 props 도 함께 받도록 ...props 를 그대로 편다.)
 */
export const MemberFieldChip = forwardRef<
	HTMLButtonElement | HTMLSpanElement,
	MemberFieldChipProps
>(({ label, editable = false, onClick, className, ...props }, ref) => {
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

	if (!editable) {
		return (
			<span ref={ref as React.Ref<HTMLSpanElement>} className={chipClassName}>
				{content}
			</span>
		);
	}

	return (
		<button
			ref={ref as React.Ref<HTMLButtonElement>}
			type="button"
			className={chipClassName}
			onClick={onClick}
			{...props}
		>
			{content}
		</button>
	);
});
MemberFieldChip.displayName = 'MemberFieldChip';

interface MemberPartChipProps {
	part: ManagedMemberPart;
	editable?: boolean;
	onClick?: () => void;
}

/**
 * 파트는 아이콘과 이름을 함께 보여준다.
 *
 * MemberFieldChip 과 마찬가지로 asChild 트리거로 쓰이므로, ref 와 (Radix 가 주입하는)
 * onClick 등은 모두 "실제로 클릭되는 그 요소" 하나에 함께 붙어야 한다. 아이콘과 칩을
 * 감싸는 바깥 div 에 ref 를 달고 칩 버튼에는 따로 onClick 을 넘기는 식으로 나누면,
 * Radix 가 위치를 재는 기준(ref)과 실제 클릭 가능한 영역(onClick)이 서로 어긋난다.
 * 그래서 editable 일 때는 아이콘까지 통째로 버튼 하나로 묶는다.
 */
export const MemberPartChip = forwardRef<HTMLButtonElement | HTMLDivElement, MemberPartChipProps>(
	({ part, editable, onClick, ...props }, ref) => {
		const icon = (
			<Image src={PART_ICON[part]} alt="" width={28} height={28} className="size-7 shrink-0" />
		);
		const label = part === 'UNASSIGNED' ? '미입력' : PART_LABEL[part];

		if (!editable) {
			return (
				<div ref={ref as React.Ref<HTMLDivElement>} className="flex items-center gap-2">
					{icon}
					<MemberFieldChip label={label} />
				</div>
			);
		}

		return (
			<button
				ref={ref as React.Ref<HTMLButtonElement>}
				type="button"
				onClick={onClick}
				className="flex cursor-pointer items-center gap-2 rounded-lg hover:bg-background-strong"
				{...props}
			>
				{icon}
				<span className="inline-flex h-8 items-center gap-1 rounded-lg border border-line-normal px-3 font-medium text-body2 text-label-subtle hover:border-line-subtle">
					<span className="truncate">{label}</span>
					<ChevronDown className="size-4 shrink-0 text-label-assistive" />
				</span>
			</button>
		);
	},
);
MemberPartChip.displayName = 'MemberPartChip';
