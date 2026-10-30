'use client';

import type React from 'react';
import { useRef } from 'react';
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
	/**
	 * 이 모달은 항상 마운트돼 있고 open 으로만 여닫는다 (Radix 가 닫힘 애니메이션을
	 * 끝까지 재생하게 하려면 그래야 한다). 그런데 호출하는 쪽은 "대상이 이 모달과
	 * 맞을 때만" subjects/description 을 채우고 그 외엔 빈 값을 넘기는 경우가 많아서,
	 * open 이 false 로 바뀌는 바로 그 렌더에서 내용이 먼저 비어버리고 그다음에 모달이
	 * 페이드아웃된다. 그래서 열려 있던 마지막 내용을 기억해두고, 닫히는 동안에는
	 * 그 내용을 계속 보여준다.
	 */
	const lastContentRef = useRef({ title, description, subjects, actions, isPending });
	// open 일 때는 최신 값으로 갱신하고, 닫히는 동안에는 방금 갱신해둔 마지막 값을 그대로 쓴다.
	if (open) {
		lastContentRef.current = { title, description, subjects, actions, isPending };
	}
	const content = lastContentRef.current;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="gap-6 sm:max-w-[505px]">
				<DialogHeader className="gap-2">
					<DialogTitle className="text-left font-bold text-headline2 text-label-normal">
						{content.title}
					</DialogTitle>
					{content.description ? (
						<DialogDescription className="text-left font-medium text-body2 text-label-assistive">
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
