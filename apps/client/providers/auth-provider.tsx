'use client';

import type { Member } from '@dpm-core/api';
import { useQuery } from '@tanstack/react-query';
import { type PropsWithChildren, useEffect, useState } from 'react';
import { Loading } from '@/components/lotties/loading';
import { UnauthenticatedLayout } from '@/layout/unauthenticated-layout';
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

	const { data: { data: memberInfo } = {}, isLoading, error } = useQuery(getMyMemberInfoQuery);

	useEffect(() => {
		if (memberInfo) {
			setIsAuthenticated(true);
			setUser(memberInfo);
		}
	}, [memberInfo]);

	if (error) {
		return <UnauthenticatedLayout />;
	}

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[inherit]">
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
