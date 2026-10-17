'use client';

import { redirect, usePathname, useRouter } from 'next/navigation';
import { type PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { auth, type Member } from '@dpm-core/api';
import { createContext } from '@dpm-core/shared';
import { UnauthenticatedLayout } from '@/components/unauthenticated-layout';
import { usePushNotification } from '@/hooks/use-push-notification';
import { consumeLoginReturnTo, getSafeFeedbackReturnTo } from '@/lib/login-return-to';
import { getMyMemberInfoQuery, getMyProfileQuery } from '@/remotes/queries/member';

interface AuthContextType {
	isAuthenticated: boolean;
	user: Member | null;
}

const PENDING_ACCESSIBLE_PATHS = ['/pending', '/profile', '/my-page', '/rejected/edit'];
const REJECTED_ACCESSIBLE_PATHS = ['/rejected', '/rejected/edit', '/my-page'];

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
	const [isAuthReady, setIsAuthReady] = useState(false);

	const pushRegistered = useRef(false);

	const pathname = usePathname();
	const router = useRouter();
	const { requestAndRegister } = usePushNotification();
	const queryClient = useQueryClient();

	useEffect(() => {
		setIsAuthReady(true);
	}, []);

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
		enabled: isAuthReady,
	});

	// 승인 대기 회원이 이름·직군을 아직 입력하지 않았다면 검토중 화면 대신 가입정보 입력으로 보낸다.
	const isPending = memberInfo?.status === 'PENDING';
	const isRejected = memberInfo?.status === 'REJECTED';
	const { data: { data: profile } = {}, isLoading: isProfileLoading } = useQuery({
		...getMyProfileQuery,
		enabled: isPending,
	});

	useEffect(() => {
		if (memberInfo) {
			setIsAuthenticated(true);
			setUser(memberInfo);

			if (!pushRegistered.current) {
				pushRegistered.current = true;
				// 실패해도 다시 시도하지 않는다. (등록 mutation 상태 변화로 리렌더될 때마다 재시도되어
				// 요청이 반복되는 것을 막는다.)
				void requestAndRegister();
			}
		}
	}, [memberInfo, requestAndRegister]);

	useEffect(() => {
		if (!memberInfo) return;

		const returnTo = consumeLoginReturnTo();
		if (!returnTo || memberInfo.status === 'PENDING' || memberInfo.status === 'REJECTED') return;

		const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
		if (returnTo !== currentPath) router.replace(returnTo);
	}, [memberInfo, router]);

	// 미로그인 인 경우, 접속 하자마자 홈으로 진입으로 변경, 로그인 페이지로 바로 진입아님
	if (error && pathname !== '/login') {
		const currentPath = `${pathname}${typeof window === 'undefined' ? '' : window.location.search}`;
		return <UnauthenticatedLayout returnTo={getSafeFeedbackReturnTo(currentPath)} />;
	}

	// 승인 대기 회원은 검토중 화면, 가입정보 화면, 마이페이지(로그아웃·탈퇴)만 이용할 수 있다.
	if (isPending) {
		if (isProfileLoading) return null;

		const pendingPath = profile?.profileCompletionRequired ? '/profile' : '/pending';
		if (
			pathname !== pendingPath &&
			(pathname === '/pending' || !PENDING_ACCESSIBLE_PATHS.includes(pathname))
		) {
			return redirect(pendingPath);
		}
	}

	// 반려 회원은 반려 안내 화면과 재신청 수정 폼만 이용할 수 있다.
	if (isRejected && pathname !== '/rejected' && !REJECTED_ACCESSIBLE_PATHS.includes(pathname)) {
		return redirect('/rejected');
	}

	if (!isAuthReady || isLoading) {
      return null;
  }

	if (memberInfo && memberInfo.status !== 'PENDING' && pathname === '/pending') {
		return redirect('/');
	}

	if (memberInfo && memberInfo.status !== 'REJECTED' && pathname === '/rejected') {
		return redirect('/');
	}

	return (
		<AuthProviderContext isAuthenticated={isAuthenticated} user={user}>
			{children}
		</AuthProviderContext>
	);
};

export { AuthProvider, useAuth };
