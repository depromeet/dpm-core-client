'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@dpm-core/shared';

import { consumeKakaoLoginToast, setLastLoginMethod } from '@/lib/last-login';
import { getMyMemberInfoQuery } from '@/remotes/queries/member';

/** 로그인 수단을 기록해 로그인 화면의 '최근 로그인' 배지에 쓰고, 카카오 로그인 직후 안내 토스트를 띄운다. */
export const LastLoginRecorder = () => {
	const { data } = useQuery(getMyMemberInfoQuery);
	const loginMethod = data?.data.loginMethod;

	useEffect(() => {
		if (loginMethod) setLastLoginMethod(loginMethod);
	}, [loginMethod]);

	useEffect(() => {
		if (consumeKakaoLoginToast()) toast.light('카카오톡으로 로그인했어요');
	}, []);

	return null;
};
