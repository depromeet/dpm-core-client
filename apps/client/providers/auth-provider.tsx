'use client';

import { redirect, usePathname } from 'next/navigation';
import { type PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { auth, type Member } from '@dpm-core/api';
import { createContext, toast } from '@dpm-core/shared';

import { UnauthenticatedLayout } from '@/components/unauthenticated-layout';
import { usePushNotification } from '@/hooks/use-push-notification';
import { getMyMemberInfoQuery } from '@/remotes/queries/member';

interface AuthContextType {
	isAuthenticated: boolean;
	user: Member | null;
}

const [AuthProviderContext, useAuth] = createContext<AuthContextType>('Auth', {
	isAuthenticated: false,
	user: null,
});

/**
 * 인증 프로바이더
 * brower로 토큰이 관리되기 때문에, 선언적 사용이 불가능
 * 항상 브라우저 상태에서 사용해야 함
 */
const AuthProvider = ({ children }: PropsWithChildren) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<Member | null>(null);

	const pushRegistered = useRef(false);

	const pathname = usePathname();
	const { requestAndRegister } = usePushNotification();
	const queryClient = useQueryClient();

	const {
		data: { data: memberInfo } = {},
		isLoading,
		error,
	} = useQuery({
		queryKey: ['memberInfo', 'reissue'],
		queryFn: async () => {
			await auth.reissue();

			const memberInfo = await queryClient.fetchQuery(getMyMemberInfoQuery);
			return memberInfo;
		},
		retry: false,
	});

	useEffect(() => {
		if (memberInfo) {
			setIsAuthenticated(true);
			setUser(memberInfo);

			if (!pushRegistered.current) {
				requestAndRegister().then((success) => {
					if (success) pushRegistered.current = true;
				});
			}
		}
	}, [memberInfo, requestAndRegister]);

	// 미로그인 인 경우, 접속 하자마자 홈으로 진입으로 변경, 로그인 페이지로 바로 진입아님
	if (error && pathname !== '/login') {
		return <UnauthenticatedLayout />;
	}

	// 로그인인데, 홈과 세션탭이 아닌경우
	if (memberInfo?.status === 'PENDING' && pathname !== '/' && pathname !== '/session') {
		if (pathname === '/auth') {
			toast.light('로그인 완료 되었습니다. 운영진이 회원 정보를 검토하고 있어요.');
			return redirect('/');
		}

		if (pathname !== '/my-page') {
			toast.error('승인 대기 중입니다. 관리자에게 문의해주세요.');
			return redirect('/');
		}
	}

	if (isLoading) {
		return null;
	}

	return (
		<AuthProviderContext isAuthenticated={isAuthenticated} user={user}>
			{children}
		</AuthProviderContext>
	);
};

export { AuthProvider, useAuth };
