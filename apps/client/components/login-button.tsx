'use client';

import { useRouter } from 'next/navigation';
import { type ComponentPropsWithoutRef, forwardRef, useState } from 'react';
import { auth, BASE_URL } from '@dpm-core/api';
import { type Button, KakaoLogo, toast } from '@dpm-core/shared';

import { useAppConfig } from '@/providers/app-config-provider';
import { useBridgeStatus, useBridgeStore } from '@/providers/bridge-provider';

import { Pressable } from './motion';

interface LoginButtonProps {
	href?: string;
	variant?: ComponentPropsWithoutRef<typeof Button>['variant'];
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
	className?: string;
}

const LoginButton = forwardRef<HTMLButtonElement, LoginButtonProps>(
	({ href, variant, size, className }, ref) => {
		const router = useRouter();
		const { isApp } = useAppConfig();
		const { isWebViewBridgeAvailable, isNativeMethodAvailable } = useBridgeStatus();
		const kakaoLogin = useBridgeStore(({ kakaoLogin }) => kakaoLogin);
		const [isPending, setIsPending] = useState(false);

		const canUseNativeKakao =
			isApp && isWebViewBridgeAvailable && isNativeMethodAvailable('kakaoLogin');

		const webFallbackUrl = (() => {
			const url = new URL(BASE_URL ?? '');
			url.pathname = '/login/kakao';
			return url.toString();
		})();

		const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
			console.log('[LoginButton] click', { canUseNativeKakao, isPending });
			if (!canUseNativeKakao) {
				console.log('[LoginButton] -> fallback to web OAuth (<a href>)');
				return;
			}

			e.preventDefault();
			if (isPending) {
				console.log('[LoginButton] -> skip, already pending');
				return;
			}

			setIsPending(true);
			try {
				const result = await kakaoLogin();

				if (!result.success) {
					if (!result.cancelled) {
						toast.error(result.error);
					}
					return;
				}

				await auth.kakaoLogin({
					accessToken: result.accessToken,
					refreshToken: result.refreshToken,
				});
				router.replace('/');
			} catch {
				toast.error('카카오 로그인에 실패했습니다.');
			} finally {
				setIsPending(false);
			}
		};

		return (
			<Pressable ref={ref} variant={variant} size={size} className={className} asChild>
				<a
					href={href ?? webFallbackUrl}
					onClick={handleClick}
					className="flex items-center gap-2 font-medium text-sm"
				>
					<KakaoLogo />
					<p className="flex-1 text-[#000000] opacity-85">카카오로 시작하기</p>
				</a>
			</Pressable>
		);
	},
);

LoginButton.displayName = 'LoginButton';

export { LoginButton };
