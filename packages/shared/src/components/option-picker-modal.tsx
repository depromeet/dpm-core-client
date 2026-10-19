'use client';

import type React from 'react';

import { type SegmentedOption, SegmentedOptions } from './segmented-options';
import { type SubjectChip, SubjectChipList } from './subject-chip-list';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

export type OptionPickerSubject = SubjectChip;

export interface OptionPickerModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: React.ReactNode;
	/** 변경 대상 목록. 비어 있으면 영역 자체를 그리지 않는다. */
	subjects?: OptionPickerSubject[];
	options: SegmentedOption[];
	value: string;
	onChange: (value: string) => void;
	onConfirm: () => void;
	confirmLabel?: string;
	cancelLabel?: string;
	confirmDisabled?: boolean;
	isPending?: boolean;
}

/**
 * 대상 목록을 보여주고 선택지 하나를 고른 뒤 확인하는 모달.
 * 어떤 값을 고르는지는 모르며, options 와 subjects 를 주는 쪽이 의미를 정한다.
 */
export const OptionPickerModal = ({
	open,
	onOpenChange,
	title,
	description,
	subjects = [],
	options,
	value,
	onChange,
	onConfirm,
	confirmLabel = '완료',
	cancelLabel = '취소',
	confirmDisabled = false,
	isPending = false,
}: OptionPickerModalProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="gap-6 sm:max-w-[589px]">
				<DialogHeader className="gap-2">
					<DialogTitle className="text-left font-bold text-headline2 text-label-normal">
						{title}
					</DialogTitle>
					{description ? (
						<DialogDescription className="text-left font-medium text-body2 text-label-assistive">
							{description}
						</DialogDescription>
					) : null}
				</DialogHeader>

				{subjects.length > 0 && <SubjectChipList subjects={subjects} className="max-h-30" />}

				<SegmentedOptions options={options} value={value} onChange={onChange} />

				<div className="flex gap-2">
					<Button
						variant="assistive"
						size="lg"
						className="flex-1"
						onClick={() => onOpenChange(false)}
					>
						{cancelLabel}
					</Button>
					<Button
						variant="secondary"
						size="lg"
						className="flex-1"
						disabled={confirmDisabled}
						loading={isPending}
						onClick={onConfirm}
					>
						{confirmLabel}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
