'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { auth } from '@dpm-core/api';

import { getMyMemberInfoQuery } from '@/remotes/queries/member';

// TODO: 서버 및 애플로그인 redirect uri 설정에 따라 불필요해질 수 있음.
const LoginSuccessPage = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const searchParams = useSearchParams();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const errorParam = searchParams.get('error');

		if (errorParam) {
			setError('로그인에 실패했습니다. 다시 시도해주세요.');
			setTimeout(() => router.replace('/login'), 3000);
			return;
		}

		const handleLoginSuccess = async () => {
			try {
				// 토큰 재발급 및 사용자 정보 로드
				await auth.reissue();
				await queryClient.prefetchQuery(getMyMemberInfoQuery);

				// 메인 페이지로 리다이렉트
				router.replace('/');
			} catch (error) {
				// 에러 시 로그인 페이지로 이동
				console.error('Login success handling failed:', error);
				setError('인증 처리 중 오류가 발생했습니다.');
				setTimeout(() => router.replace('/login'), 3000);
			}
		};

		handleLoginSuccess();
	}, [router, queryClient, searchParams]);

	if (error) {
		return (
			<div className="flex min-h-dvh flex-col items-center justify-center gap-4">
				<p className="text-label-strong">{error}</p>
				<p className="text-label-assistive text-sm">잠시 후 로그인 페이지로 이동합니다.</p>
			</div>
		);
	}

	return (
		<div className="flex min-h-dvh items-center justify-center">
			<p className="text-label-assistive">로그인 중...</p>
		</div>
	);
};

export default LoginSuccessPage;
