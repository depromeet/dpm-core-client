import type React from 'react';
import { useLayoutEffect, useState } from 'react';
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

interface ContentProps {
	title: string;
	description?: React.ReactNode;
	subjects?: SubjectChip[];
	/** 왼쪽부터 순서대로 그린다. 하나만 주면 가로로 꽉 채운다. */
	actions: DialogAction[];
	isPending?: boolean;
}

interface MemberConfirmDialogProps extends ContentProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const EMPTY_SUBJECTS: SubjectChip[] = [];

/** 대상을 확인시키고 동작을 고르게 하는 모달. 승인·반려·삭제가 같은 틀을 쓴다. */
export const MemberConfirmDialog = ({
	open,
	onOpenChange,
	title,
	description,
	subjects = EMPTY_SUBJECTS,
	actions,
	isPending = false,
}: MemberConfirmDialogProps) => {
	const currentContent = { title, description, subjects, actions, isPending };
	const [lastOpenContent, setLastOpenContent] = useState<typeof currentContent | null>(null);

	useLayoutEffect(() => {
		if (!open) return;

		function rememberOpenContent() {
			setLastOpenContent({ title, description, subjects, actions, isPending });
		}

		rememberOpenContent();
	}, [open, title, description, subjects, actions, isPending]);

	const content = open ? currentContent : lastOpenContent;
	if (!content) {
		return null;
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="gap-6 sm:max-w-126.25">
				<DialogHeader className="gap-2">
					<DialogTitle className="text-left text-headline2 font-bold text-label-normal">
						{content.title}
					</DialogTitle>
					{content.description ? (
						<DialogDescription className="text-left text-body2 font-medium text-label-assistive">
							{content.description}
						</DialogDescription>
					) : null}
				</DialogHeader>

				{content.subjects.length > 0 && (
					<div data-clarity-mask="True">
						<SubjectChipList subjects={content.subjects} />
					</div>
				)}

				<div className="flex gap-2">
					{content.actions.map((action, index) => (
						<Button
							key={action.label}
							variant={
								action.variant ?? (index === content.actions.length - 1 ? 'secondary' : 'assistive')
							}
							size="lg"
							className="flex-1"
							loading={content.isPending && index === content.actions.length - 1}
							onClick={open ? action.onClick : undefined}
						>
							{action.label}
						</Button>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
};
