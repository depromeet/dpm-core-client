'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft } from '@dpm-core/shared';

import { deleteToken } from '@/lib/utils';
import { logoutMutationOptions } from '@/remotes/mutations/auth';

/**
 * 가입정보 입력 화면의 뒤로가기.
 * 승인 대기 회원이 /login 으로 가면 AuthProvider가 다시 이 화면으로 돌려보내므로,
 * 로그아웃으로 세션을 정리한 뒤 로그인 화면으로 이동한다.
 */
export const ProfileBackButton = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { mutate: logout, isPending } = useMutation(
		logoutMutationOptions({
			// 서버 로그아웃이 실패해도 이 기기의 세션은 정리하고 로그인 화면으로 보낸다.
			onSettled: () => {
				queryClient.clear();
				deleteToken();
				router.replace('/login');
			},
		}),
	);

	const handleBackClick = () => {
		if (isPending) return;
		logout();
	};

	return (
		<button
			type="button"
			aria-label="로그인 화면으로 돌아가기"
			onClick={handleBackClick}
			className="absolute left-4"
		>
			<ChevronLeft />
		</button>
	);
};
