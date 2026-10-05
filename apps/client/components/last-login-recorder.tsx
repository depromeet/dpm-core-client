'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { setLastLoginMethod } from '@/lib/last-login';
import { getMyMemberInfoQuery } from '@/remotes/queries/member';

/** 로그인된 회원의 로그인 수단을 기록해 로그인 화면의 '최근 로그인' 배지에 사용한다. */
export const LastLoginRecorder = () => {
	const { data } = useQuery(getMyMemberInfoQuery);
	const loginMethod = data?.data.loginMethod;

	useEffect(() => {
		if (loginMethod) setLastLoginMethod(loginMethod);
	}, [loginMethod]);

	return null;
};
