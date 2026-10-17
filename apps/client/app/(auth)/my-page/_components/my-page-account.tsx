'use client';

import type { ReactNode } from 'react';
import type { LoginMethod } from '@dpm-core/api';
import { AppleLogo, Button, cn, KakaoLogo, toast } from '@dpm-core/shared';

import { useKakaoLogin } from '@/hooks/use-kakao-login';
import { markKakaoLoginToast } from '@/lib/last-login';

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
 * TODO: 연동 해제 API 연동 — 현재는 API 서버를 사용할 수 없어 성공 토스트만 띄운다.
 */
export const MyPageAccount = ({ loginMethod, email }: MyPageAccountProps) => {
	const { canUseNativeKakao, loginWithNative, webFallbackUrl, isPending } = useKakaoLogin();

	const isAppleMember = loginMethod === 'APPLE';

	const handleUnlink = () => {
		toast.success('계정 연동이 해제되었어요.');
	};

	// 카카오로 로그인하면 홈에서 활동 정보 입력 시트와 '카카오톡으로 로그인했어요' 토스트가 이어진다.
	const handleKakaoLink = () => {
		if (canUseNativeKakao) {
			void loginWithNative({
				onSuccess: () => {
					markKakaoLoginToast();
					window.location.assign('/');
				},
			});
			return;
		}
		markKakaoLoginToast();
		window.location.href = webFallbackUrl;
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
						<Button
							variant="secondary"
							size="sm"
							className="text-body2"
							onClick={handleKakaoLink}
							disabled={isPending}
						>
							연동
						</Button>
					</AccountRow>
				</div>
			) : (
				<AccountRow method={loginMethod} label={email} />
			)}
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
