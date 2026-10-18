'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import type { LoginMethod } from '@dpm-core/api';
import {
	AppleLogo,
	Button,
	cn,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	KakaoLogo,
	toast,
} from '@dpm-core/shared';

import { MyPageBox } from './my-page-box';

function getSocialIcon(method: LoginMethod | undefined) {
	if (method === 'KAKAO') {
		return {
			icon: <KakaoLogo className="h-2.5 w-3" />,
			background: 'bg-[#FEE500]',
		};
	}
	if (method === 'APPLE') {
		return {
			icon: <AppleLogo className="h-3 w-2.5" />,
			background: 'bg-[#1F2937]',
		};
	}
	return null;
}

interface MyPageAccountProps {
	loginMethod: LoginMethod | undefined;
	email: string;
}

/**
 * 계정 정보
 * 애플 회원에게는 카카오톡 계정 연동 버튼을 함께 보여준다.
 * TODO: 연동/연동 해제 API 연동 — 현재는 API 서버를 사용할 수 없어 준비중 안내만 띄운다.
 */
export const MyPageAccount = ({ loginMethod, email }: MyPageAccountProps) => {
	const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

	const isAppleMember = loginMethod === 'APPLE';

	const handleUnlink = () => {
		toast.success('계정 연동이 해제되었어요.');
	};

	const handleKakaoLink = () => {
		setIsComingSoonOpen(true);
	};

	return (
		<MyPageBox className="flex flex-col gap-2">
			<p className="font-semibold text-body2 text-label-assistive">계정 정보</p>
			{isAppleMember ? (
				<div className="flex flex-col gap-2">
					<AccountRow method="APPLE" label={email}>
						<Button
							variant="assistive"
							size="sm"
							className="text-body2 text-label-subtle"
							onClick={handleUnlink}
						>
							해제
						</Button>
					</AccountRow>
					<AccountRow method="KAKAO" label="카카오톡 계정">
						<Button variant="secondary" size="sm" className="text-body2" onClick={handleKakaoLink}>
							연동
						</Button>
					</AccountRow>
				</div>
			) : (
				<AccountRow method={loginMethod} label={email} />
			)}
			<Dialog open={isComingSoonOpen} onOpenChange={setIsComingSoonOpen}>
				<DialogContent showCloseButton={false}>
					<DialogTitle className="sr-only">준비 중인 기능이에요</DialogTitle>
					<DialogHeader className="text-left font-bold text-title1">
						준비 중인 기능이에요
					</DialogHeader>
					<p className="text-body1 text-label-subtle">계정 연동 기능은 곧 만나보실 수 있어요.</p>
					<DialogFooter>
						<Button
							className="flex-1"
							variant="secondary"
							size="lg"
							onClick={() => setIsComingSoonOpen(false)}
						>
							확인
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</MyPageBox>
	);
};

const AccountRow = ({
	method,
	label,
	children,
}: {
	method: LoginMethod | undefined;
	label: string;
	children?: ReactNode;
}) => {
	const socialIcon = getSocialIcon(method);

	return (
		<div className={cn('flex items-center justify-between gap-2', children != null && 'h-9')}>
			<p className="flex gap-2 font-medium text-body2 text-label-subtle">
				{socialIcon != null ? (
					<span
						className={cn(
							'inline-grid aspect-square w-5 place-items-center rounded-full',
							socialIcon.background,
						)}
					>
						{socialIcon.icon}
					</span>
				) : null}
				{label}
			</p>
			{children}
		</div>
	);
};
