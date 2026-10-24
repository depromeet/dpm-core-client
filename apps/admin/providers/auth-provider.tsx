'use client';

import { usePathname } from 'next/navigation';
import { type PropsWithChildren, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { auth, clearAuthCookies, type Member } from '@dpm-core/api';
import { createContext } from '@dpm-core/shared';

import { UnauthenticatedLayout } from '@/components/unauthenticated-layout';
import { logoutMutationOptions } from '@/remotes/mutations/auth';
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
	const [isReady, setIsReady] = useState(false);
	const pathname = usePathname();

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
		enabled: isReady,
	});

	// 운영진이 아닌 계정은 권한 없음 화면으로 보낸다. 캐시된 회원 정보가 다음 로그인에 섞이지 않도록
	// 쿠키를 정리하고 전체 이동한다. 서버 로그아웃이 실패해도 이 브라우저의 세션은 정리한다.
	const { mutate: logoutMutate } = useMutation(
		logoutMutationOptions({
			onSettled: () => {
				clearAuthCookies();
				window.location.replace('/auth');
			},
		}),
	);
	const isForbidden = Boolean(memberInfo) && !memberInfo?.isAdmin;

	useEffect(() => {
		setIsReady(true);
	}, []);

	useEffect(() => {
		if (memberInfo) {
			if (!memberInfo.isAdmin) {
				logoutMutate();
				return;
			}
			setIsAuthenticated(true);
			setUser(memberInfo);
		}
	}, [memberInfo, logoutMutate]);

	if (isReady && error && pathname !== '/login') {
		return <UnauthenticatedLayout />;
	}

	if (!isReady || isLoading) {
		// return (
		// 	<div className="flex flex-col items-center justify-center h-dvh">
		// 		<Loading />
		// 	</div>
		// );

		return null;
	}

	// 권한 없는 계정에는 화면을 그리지 않아, 운영진 전용 API가 403으로 실패하며 오류 화면이 뜨는 것을 막는다.
	if (isForbidden) {
		return null;
	}

	return (
		<AuthProviderContext isAuthenticated={isAuthenticated} user={user}>
			{children}
		</AuthProviderContext>
	);
};

export { AuthProvider, useAuth };
