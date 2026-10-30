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
} from '@dpm-core/shared';

import { PART_LABEL } from '../_constants';
import type { MemberRow } from '../_types';
import { MemberLoginMethodIcon } from './MemberLoginMethodIcon';

interface MemberMergeAccountDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/**
	 * confirm: 같은 사람으로 보이는 승인 계정에 병합할지 묻는다. (취소 / 병합하기)
	 * conflict: 같은 소셜의 다른 계정이라 병합할 수 없음을 알린다. (확인)
	 */
	variant: 'confirm' | 'conflict';
	/** 병합 상대가 될 이미 승인된 계정들 */
	approvedAccounts: MemberRow[];
	/** confirm 일 때 설명 아래에 덧붙이는 안내 (예: 함께 선택한 계정은 일반 승인된다는 설명) */
	note?: React.ReactNode;
	isPending?: boolean;
	onConfirm: () => void;
}

const COPY = {
	confirm: {
		title: '병합이 필요한 계정',
		description: (
			<>
				같은 이름과 직군을 가진 계정이 승인되어있어요. 이 계정과 병합할까요?
				<br />
				동명의 다른 회원이 아닌지 유의해주세요.
			</>
		),
	},
	conflict: {
		title: '다른 회원의 계정으로 병합 불가',
		description: (
			<>
				동일한 소셜(애플, 카카오)의 다른 이메일로 가입해 다른 회원으로 추정돼요.
				<br />
				다른 회원의 계정끼리는 병합이 불가능해요.
			</>
		),
	},
} as const;

/**
 * 미승인 계정을 이미 승인된 계정에 병합하기 전에 상대 계정을 보여주는 모달.
 * 이 모달은 항상 마운트돼 있고 open 으로만 여닫으므로, 닫히는 동안에는 마지막으로 열려 있던
 * 내용을 계속 보여준다 (MemberConfirmDialog 와 같은 이유).
 */
export const MemberMergeAccountDialog = ({
	open,
	onOpenChange,
	variant,
	approvedAccounts,
	note,
	isPending = false,
	onConfirm,
}: MemberMergeAccountDialogProps) => {
	const lastContentRef = useRef({ variant, approvedAccounts, note, isPending });
	if (open) lastContentRef.current = { variant, approvedAccounts, note, isPending };
	const content = lastContentRef.current;
	const copy = COPY[content.variant];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="gap-6 sm:max-w-[505px]">
				<DialogHeader className="gap-2">
					<DialogTitle className="text-left font-bold text-headline2 text-label-normal">
						{copy.title}
					</DialogTitle>
					<DialogDescription className="text-left font-medium text-body2 text-label-assistive">
						{copy.description}
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-3">
					<p className="font-medium text-body2 text-label-assistive">이미 승인된 계정</p>
					{content.approvedAccounts.map((account) => (
						<dl
							key={account.id}
							data-clarity-mask="True"
							className="grid grid-cols-[4.5rem_1fr] gap-x-8 gap-y-3 rounded-2xl bg-background-strong px-8 py-6 font-medium text-body2"
						>
							<dt className="text-label-assistive">이름</dt>
							<dd className="font-semibold text-label-normal">{account.name}</dd>
							<dt className="text-label-assistive">직군</dt>
							<dd className="font-semibold text-label-normal">{PART_LABEL[account.part]}</dd>
							<dt className="text-label-assistive">로그인 계정</dt>
							<dd className="flex items-center gap-2 text-label-normal">
								<MemberLoginMethodIcon loginMethod={account.loginMethod} />
								<span className="truncate">{account.email ?? '이메일 정보 없음'}</span>
							</dd>
						</dl>
					))}
				</div>

				{content.variant === 'confirm' && content.note ? (
					<p className="font-medium text-body2 text-label-assistive">{content.note}</p>
				) : null}

				<div className="flex gap-2">
					{content.variant === 'confirm' ? (
						<>
							<Button
								variant="assistive"
								size="lg"
								className="flex-1"
								onClick={() => onOpenChange(false)}
							>
								취소
							</Button>
							<Button
								variant="secondary"
								size="lg"
								className="flex-1"
								loading={content.isPending}
								onClick={onConfirm}
							>
								병합하기
							</Button>
						</>
					) : (
						<Button variant="secondary" size="lg" className="flex-1" onClick={onConfirm}>
							확인
						</Button>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};
