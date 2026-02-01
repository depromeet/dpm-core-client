'use client';

import { X } from 'lucide-react';

import { IconButton } from '../icon-button';
import { ToggleGroup, ToggleGroupItem } from '../toggle-group';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '../ui/dialog';

export type SubmissionStatus = 'pending' | 'not_submitted' | 'late' | 'completed';

const statusOptions = [
	{ value: 'completed', label: '제출 완료' },
	{ value: 'late', label: '지각 제출' },
	{ value: 'not_submitted', label: '미제출' },
	{ value: 'pending', label: '확인 전' },
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
			<DialogContent className="max-w-160">
				<DialogHeader className="pt-8 pb-4">
					<div className="flex items-center justify-between">
						<DialogTitle className="font-bold text-headline2 text-label-normal">
							제출 상태 변경
						</DialogTitle>
						<IconButton variant="ghost" size="sm" onClick={() => onOpenChange?.(false)}>
							<X className="size-4" />
						</IconButton>
					</div>
					<DialogDescription className="font-medium text-body2 text-label-subtle">
						선택한 인원의 과제 제출 상태가 지정한 값으로 일괄 변경됩니다.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-6 py-6">
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
						>
							{statusOptions.map(({ value, label }) => (
								<ToggleGroupItem key={value} value={value}>
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

				<DialogFooter className="pt-6 pb-8">
					<Button variant="secondary" size="lg" className="w-full" onClick={onSave}>
						저장하기
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
