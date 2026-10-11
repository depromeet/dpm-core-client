'use client';

import { redirect, usePathname } from 'next/navigation';
import { type PropsWithChildren, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { auth, type Member } from '@dpm-core/api';
import { createContext } from '@dpm-core/shared';

import { UnauthenticatedLayout } from '@/components/unauthenticated-layout';
import { disableAdminDevMock, isAdminDevMockEnabled, MOCK_ADMIN_MEMBER } from '@/lib/dev-mock-auth';
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
	const [isMockAuth, setIsMockAuth] = useState(false);
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
		enabled: isReady && !isMockAuth,
	});

	const { mutate: logoutMutate } = useMutation(logoutMutationOptions());

	useEffect(() => {
		setIsMockAuth(isAdminDevMockEnabled());
		setIsReady(true);
	}, []);

	useEffect(() => {
		if (!isMockAuth && memberInfo) {
			if (!memberInfo.isAdmin) {
				logoutMutate();
				redirect('/login');
			}
			setIsAuthenticated(true);
			setUser(memberInfo);
		}
	}, [isMockAuth, memberInfo, logoutMutate]);

	if (isReady && !isMockAuth && error && pathname !== '/login') {
		return <UnauthenticatedLayout />;
	}

	if (!isReady || (!isMockAuth && isLoading)) {
		// return (
		// 	<div className="flex flex-col items-center justify-center h-dvh">
		// 		<Loading />
		// 	</div>
		// );

		return null;
	}

	if (isMockAuth) {
		return (
			<AuthProviderContext isAuthenticated user={MOCK_ADMIN_MEMBER}>
				<div className="fixed right-2 bottom-2 z-[100] flex items-center gap-2 rounded-md bg-amber-100 px-3 py-2 text-amber-950 text-xs shadow">
					개발용 Mock 로그인
					<button
						type="button"
						className="cursor-pointer underline"
						onClick={() => {
							disableAdminDevMock();
							window.location.assign('/login');
						}}
					>
						종료
					</button>
				</div>
				{children}
			</AuthProviderContext>
		);
	}

	return (
		<AuthProviderContext isAuthenticated={isAuthenticated} user={user}>
			{children}
		</AuthProviderContext>
	);
};

export { AuthProvider, useAuth };
