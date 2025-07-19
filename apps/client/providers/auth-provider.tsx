'use client';

import { getMyMemberInfo } from '@dpm-core/api';
import { useQuery } from '@tanstack/react-query';
import { RedirectType, redirect } from 'next/navigation';
import { createContext, type PropsWithChildren, useEffect, useState } from 'react';

interface AuthContextType {
	isAuthenticated: boolean;
	user: number | null;
}

export const AuthContext = createContext<AuthContextType>({
	isAuthenticated: false,
	user: 1,
});

/**
 * 인증 프로바이더
 * brower로 토큰이 관리되기 때문에, 선언적 사용이 불가능
 * 항상 브라우저 상태에서 사용해야 함
 */
const AuthProvider = ({ children }: PropsWithChildren) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<number | null>(null);

	const { data, isLoading, error } = useQuery({
		queryKey: ['get-my-member-info'],
		queryFn: () => {
			return getMyMemberInfo();
		},
		retry: false,
		refetchInterval: false,
	});

	useEffect(() => {
		if (data) {
			setIsAuthenticated(true);
			// setUser(data.data.memberId);
		}
	}, [data]);

	if (error) {
		return <UnauthenticatedLayout />;
	}

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				user,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthProvider };

function UnauthenticatedLayout() {
	return redirect('/login', RedirectType.replace);
}
