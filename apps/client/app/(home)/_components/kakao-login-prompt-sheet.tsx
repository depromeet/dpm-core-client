'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
	Button,
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerTitle,
	useAppShell,
} from '@dpm-core/shared';

import { useKakaoLogin } from '@/hooks/use-kakao-login';
import { dismissKakaoPrompt, isKakaoPromptDismissed, markKakaoLoginToast } from '@/lib/last-login';
import { getMyMemberInfoQuery } from '@/remotes/queries/member';

import { useAppleProfileSetup } from '../_hooks/use-apple-profile-setup';

type KakaoPromptVariant = 'login' | 'merge';

const PROMPT_COPY = {
	login: {
		title: ['더 안정적인 운영을 위해 카카오톡으로', '로그인해주세요.'],
		description: '애플 로그인 시, 계정이 불안정해 접속이 원활하지 않을 수 있어요.',
		buttonLabel: '카카오톡으로 로그인',
	},
	merge: {
		title: ['더 안정적인 운영을 위해 카카오톡으로', '계정을 병합해주세요.'],
		description: '카카오톡으로 병합 시, 기존에 가입했던 애플 계정은 삭제됩니다.',
		buttonLabel: '카카오톡으로 계정 병합',
	},
} satisfies Record<
	KakaoPromptVariant,
	{ title: string[]; description: string; buttonLabel: string }
>;

/**
 * 애플 로그인 회원에게 카카오톡 로그인을 유도하는 바텀시트
 *
 * 애플 프로필(이름/직군) 설정 시트와 겹치지 않도록 설정이 끝난 뒤에만 노출하고,
 * 닫으면 해당 세션 동안 다시 띄우지 않는다.
 * 'merge' 변형은 카카오 로그인 후 기존 애플 계정이 확인되는 경우에 쓰며, 병합 여부를 판별하는 API 연동 후 사용한다.
 */
export const KakaoLoginPromptSheet = ({ variant = 'login' }: { variant?: KakaoPromptVariant }) => {
	const { data } = useQuery(getMyMemberInfoQuery);
	const { isSetupRequired } = useAppleProfileSetup();
	const { ref } = useAppShell();
	const { canUseNativeKakao, loginWithNative, webFallbackUrl, isPending } = useKakaoLogin();
	const [isOpen, setIsOpen] = useState(false);

	const isAppleMember = data?.data.loginMethod === 'APPLE';

	useEffect(() => {
		if (isAppleMember && !isSetupRequired && !isKakaoPromptDismissed()) {
			setIsOpen(true);
		}
	}, [isAppleMember, isSetupRequired]);

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (!open) dismissKakaoPrompt();
	};

	// 카카오로 새로 로그인하면 승인 대기 홈으로 들어오므로, 회원 정보 캐시를 비우기 위해 전체 이동한다.
	// 이동한 홈에서 '카카오톡으로 로그인했어요' 토스트를 띄운다.
	const handleKakaoLogin = () => {
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

	const copy = PROMPT_COPY[variant];

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange} container={ref.current}>
			<DrawerContent
				className="mx-auto gap-3 px-6 pt-7.5 pb-safe-area"
				style={{ maxWidth: ref.current?.clientWidth ?? 'auto' }}
			>
				<DrawerTitle className="text-left font-semibold text-label-normal text-title2">
					{copy.title[0]}
					<br />
					{copy.title[1]}
				</DrawerTitle>
				<DrawerDescription className="text-left font-medium text-body2 text-label-assistive">
					{copy.description}
				</DrawerDescription>
				<Button
					variant="secondary"
					size="full"
					className="mt-3 mb-5.5 h-12 rounded-lg"
					onClick={handleKakaoLogin}
					disabled={isPending}
				>
					{copy.buttonLabel}
				</Button>
			</DrawerContent>
		</Drawer>
	);
};
