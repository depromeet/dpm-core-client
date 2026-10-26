'use client';

import { redirect, usePathname, useRouter } from 'next/navigation';
import { type PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { auth, type Member } from '@dpm-core/api';
import { createContext } from '@dpm-core/shared';
import { UnauthenticatedLayout } from '@/components/unauthenticated-layout';
import { usePushNotification } from '@/hooks/use-push-notification';
import { setLastLoginMethod } from '@/lib/last-login';
import { consumeLoginReturnTo, getSafeFeedbackReturnTo } from '@/lib/login-return-to';
import { isProfileIncomplete } from '@/lib/profile-completion';
import { getMyMemberInfoQuery, getMyProfileQuery } from '@/remotes/queries/member';

interface AuthContextType {
	isAuthenticated: boolean;
	user: Member | null;
}

const PENDING_ACCESSIBLE_PATHS = ['/pending', '/profile', '/my-page', '/rejected/edit'];
// '/pending'을 넣으면 검토중 화면을 보던 회원이 반려돼도 /rejected로 가지 못하고 검토중 화면에 머문다.
// 재신청 성공 시에는 /rejected/edit 에서 상태 캐시 무효화가 끝난 뒤에 /pending 으로 이동하므로 포함하지 않아도 된다.
const REJECTED_ACCESSIBLE_PATHS = ['/rejected', '/rejected/edit', '/my-page'];

/** AuthProvider가 승인 상태 판단에 쓰는 멤버 정보 쿼리 키. 상태를 바꾸는 요청(예: 재신청) 후에는 이 키를 무효화해야 AuthProvider가 바뀐 상태를 바로 반영한다. */
export const memberAuthQueryKey = ['memberInfo', 'reissue'];

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
		queryKey: memberAuthQueryKey,
		queryFn: async () => {
			await auth.reissue();

			// 앱 기본 staleTime(5분) 안에 받아 둔 getMyMemberInfoQuery 캐시가 있으면 fetchQuery 가 재요청 없이
			// 그 값을 돌려준다. 재신청 직후 이 쿼리를 무효화하면 직전(REJECTED)의 캐시가 그대로 반환돼
			// 상태가 PENDING에서 REJECTED로 되돌아가므로, 이 쿼리는 항상 서버에서 새로 받는다.
			const memberInfo = await queryClient.fetchQuery({ ...getMyMemberInfoQuery, staleTime: 0 });
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
			// 홈에 도달하지 못하는 승인 대기·반려 회원도 로그인 화면의 '최근 로그인' 배지가 갱신되도록 여기서 기록한다.
			if (memberInfo.loginMethod) setLastLoginMethod(memberInfo.loginMethod);

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
		const search = typeof window === 'undefined' ? '' : window.location.search;
		const currentPath = `${pathname}${search}`;
		// 소셜 로그인 실패(예: 탈퇴한 계정)로 루트에 돌아온 경우, 안내 토스트가 뜨도록 코드를 로그인 화면에 넘긴다.
		const errorCode = new URLSearchParams(search).get('errorCode');
		return (
			<UnauthenticatedLayout
				returnTo={getSafeFeedbackReturnTo(currentPath)}
				errorCode={errorCode}
			/>
		);
	}

	// 승인 대기 회원은 검토중 화면, 가입정보 화면, 마이페이지(로그아웃·탈퇴)만 이용할 수 있다.
	if (isPending) {
		if (isProfileLoading) return null;

		const pendingPath = profile && isProfileIncomplete(profile) ? '/profile' : '/pending';
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

	// REJECTED는 제외한다: 재신청 직후 상태 캐시가 아직 REJECTED로 남아있는 순간에도
	// 이 체크가 먼저 걸려 홈으로, 이어서 홈의 반려자 가드에 의해 다시 /rejected로 튕겨나가는 것을 막는다.
	if (
		memberInfo &&
		memberInfo.status !== 'PENDING' &&
		memberInfo.status !== 'REJECTED' &&
		pathname === '/pending'
	) {
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
