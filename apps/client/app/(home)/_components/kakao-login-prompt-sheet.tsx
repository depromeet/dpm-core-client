'use client';

import { useRouter } from 'next/navigation';
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

type KakaoPromptVariant = 'link' | 'merge';

const PROMPT_COPY = {
	link: {
		title: ['더 안정적인 운영을 위해 카카오톡 계정을', '추가로 연동해주세요.'],
		description: '애플 로그인 시, 계정이 불안정해 접속이 원활하지 않을 수 있어요.',
		buttonLabel: '카카오톡 계정 연동하기',
	},
	merge: {
		title: ['더 안정적인 운영을 위해 카카오톡으로', '계정을 병합해주세요.'],
		description: '더 안정적인 운영을 위해 카카오톡으로 계정을 병합해주세요.',
		buttonLabel: '카카오톡으로 계정 병합',
	},
} satisfies Record<
	KakaoPromptVariant,
	{ title: string[]; description: string; buttonLabel: string }
>;

interface KakaoLoginPromptSheetProps {
	variant?: KakaoPromptVariant;
	/** 지정하면 자동 노출 조건 대신 부모가 열림 상태를 제어한다. (예: 병합 시트) */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

/**
 * 애플 로그인 회원에게 카카오톡 계정 연동을 유도하는 바텀시트
 *
 * 애플 프로필(이름/직군) 설정 시트와 겹치지 않도록 설정이 끝난 뒤에만 노출하고,
 * 닫으면 해당 세션 동안 다시 띄우지 않는다.
 * 'link' 변형은 마이페이지 계정 정보로 이동해 연동하도록 안내한다.
 * 'merge' 변형은 파트/이름/이메일이 같은 기존 계정이 확인되는 경우에 쓰며, 병합 여부를 판별하는 API 연동 후 사용한다.
 */
export const KakaoLoginPromptSheet = ({
	variant = 'link',
	open,
	onOpenChange,
}: KakaoLoginPromptSheetProps) => {
	const router = useRouter();
	const { data } = useQuery(getMyMemberInfoQuery);
	const { isSetupRequired } = useAppleProfileSetup();
	const { ref } = useAppShell();
	const { canUseNativeKakao, loginWithNative, webFallbackUrl, isPending } = useKakaoLogin();
	const [isAutoOpen, setIsAutoOpen] = useState(false);
	const isControlled = open !== undefined;
	const isOpen = isControlled ? open : isAutoOpen;

	const isAppleMember = data?.data.loginMethod === 'APPLE';

	useEffect(() => {
		if (!isControlled && isAppleMember && !isSetupRequired && !isKakaoPromptDismissed()) {
			setIsAutoOpen(true);
		}
	}, [isControlled, isAppleMember, isSetupRequired]);

	const handleOpenChange = (nextOpen: boolean) => {
		if (isControlled) onOpenChange?.(nextOpen);
		else setIsAutoOpen(nextOpen);
		if (!nextOpen) dismissKakaoPrompt();
	};

	// 병합: 카카오로 새로 로그인하면 승인 대기 홈으로 들어오므로, 회원 정보 캐시를 비우기 위해 전체 이동한다.
	// 이동한 홈에서 '카카오톡으로 로그인했어요' 토스트를 띄운다.
	const handleKakaoLogin = () => {
		if (variant === 'link') {
			dismissKakaoPrompt();
			router.push('/my-page');
			return;
		}

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
