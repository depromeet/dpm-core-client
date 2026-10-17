'use client';

import type React from 'react';
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	type SubjectChip,
	SubjectChipList,
} from '@dpm-core/shared';

interface DialogAction {
	label: string;
	onClick: () => void;
	variant?: 'secondary' | 'assistive';
}

interface MemberConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: React.ReactNode;
	subjects?: SubjectChip[];
	/** 왼쪽부터 순서대로 그린다. 하나만 주면 가로로 꽉 채운다. */
	actions: DialogAction[];
	isPending?: boolean;
}

/** 대상을 확인시키고 동작을 고르게 하는 모달. 승인·반려·삭제가 같은 틀을 쓴다. */
export const MemberConfirmDialog = ({
	open,
	onOpenChange,
	title,
	description,
	subjects = [],
	actions,
	isPending = false,
}: MemberConfirmDialogProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="gap-6 sm:max-w-[505px]">
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

				{subjects.length > 0 && <SubjectChipList subjects={subjects} />}

				<div className="flex gap-2">
					{actions.map((action, index) => (
						<Button
							key={action.label}
							variant={action.variant ?? (index === actions.length - 1 ? 'secondary' : 'assistive')}
							size="lg"
							className="flex-1"
							loading={isPending && index === actions.length - 1}
							onClick={action.onClick}
						>
							{action.label}
						</Button>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
};
