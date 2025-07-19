'use client';

import { auth, type Member } from '@dpm-core/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { type PropsWithChildren, useEffect, useState } from 'react';
import { Loading } from '@/components/lotties/loading';
import { UnauthenticatedLayout } from '@/components/unauthenticated-layout';
import { createContext } from '@/providers/create-context';
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
	const pathname = usePathname();

	const queryClient = useQueryClient();

	const {
		data: { data: memberInfo } = {},
		isLoading,
		error,
	} = useQuery({
		queryKey: ['memberInfo', 'reissue'],
		queryFn: async () => {
			const { data } = await auth.reissue();

			const memberInfo = await queryClient.fetchQuery(getMyMemberInfoQuery);
			return memberInfo;
		},
		retry: false,
	});

	useEffect(() => {
		if (memberInfo) {
			setIsAuthenticated(true);
			setUser(memberInfo);
		}
	}, [memberInfo]);

	if (error && pathname !== '/login') {
		return <UnauthenticatedLayout />;
	}

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-dvh">
				<Loading />
			</div>
		);
	}

	return (
		<AuthProviderContext isAuthenticated={isAuthenticated} user={user}>
			{children}
		</AuthProviderContext>
	);
};

export { AuthProvider, useAuth };
