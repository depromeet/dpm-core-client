'use client';

import { X } from 'lucide-react';

import { IconButton } from '../icon-button';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '../ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

export type SubmissionStatus = 'pending' | 'not_submitted' | 'late' | 'completed';

const statusOptions = [
	{ value: 'pending', label: '확인 전' },
	{ value: 'completed', label: '제출 완료' },
	{ value: 'late', label: '지각 제출' },
	{ value: 'not_submitted', label: '미제출' },
];

export interface SubmissionStatusModalProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	selectedStatus?: SubmissionStatus;
	onStatusChange?: (status: SubmissionStatus) => void;
	affectedUsers?: string[];
	onSave?: () => void;
}

export const SubmissionStatusModal = ({
	open = false,
	onOpenChange,
	selectedStatus = 'pending',
	onStatusChange,
	affectedUsers = [],
	onSave,
}: SubmissionStatusModalProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-160! gap-0 p-0" showCloseButton={false}>
				<DialogHeader className="gap-3 px-8 pt-8 pb-4">
					<div className="flex items-center justify-between">
						<DialogTitle className="font-bold text-headline2 text-label-normal">
							제출 상태 변경
						</DialogTitle>
						<IconButton
							variant="ghost"
							size="sm"
							onClick={() => onOpenChange?.(false)}
							className="size-7 rounded-full bg-background-strong p-1.5"
						>
							<X className="size-4" />
						</IconButton>
					</div>
					<DialogDescription className="text-left font-medium text-[##81898F]! text-[14px] leading-5.5">
						선택한 인원의 과제 제출 상태가 지정한 값으로 일괄 변경됩니다.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-6 px-8 py-6">
					<div className="flex flex-col gap-2">
						<label
							htmlFor="submission-status"
							className="font-semibold text-body2 text-label-subtle"
						>
							과제 제출 상태
						</label>
						<ToggleGroup
							id="submission-status"
							type="single"
							value={selectedStatus}
							onValueChange={(value: string | string[]) => {
								if (typeof value === 'string' && value) onStatusChange?.(value as SubmissionStatus);
							}}
							className="w-full overflow-hidden rounded-lg border border-line-normal"
						>
							{statusOptions.map(({ value, label }) => (
								<ToggleGroupItem
									key={value}
									value={value}
									className="h-12 flex-1 rounded-none border-line-normal border-r last:border-r-0 data-[state=off]:bg-background-normal data-[state=on]:bg-primary-extralight data-[state=off]:text-label-assistive data-[state=on]:text-primary-normal"
								>
									{label}
								</ToggleGroupItem>
							))}
						</ToggleGroup>
					</div>
					{affectedUsers.length > 0 && (
						<p className="font-semibold text-body1 text-label-subtle">
							수정 적용 대상 :{' '}
							{affectedUsers.length === 1
								? affectedUsers[0]
								: `${affectedUsers[0]} 외 ${affectedUsers.length - 1}명`}
						</p>
					)}
				</div>

				<DialogFooter className="px-8 pt-6 pb-8">
					<Button
						variant="secondary"
						size="lg"
						className="w-full bg-background-inverse text-label-inverse hover:bg-background-inverse/90"
						onClick={onSave}
					>
						저장하기
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
