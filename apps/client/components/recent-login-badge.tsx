'use client';

import { useEffect, useState } from 'react';

import { getLastLoginMethod } from '@/lib/last-login';

/** 카카오로 마지막 로그인한 경우에만 카카오 버튼 위에 노출한다. */
export const RecentLoginBadge = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(getLastLoginMethod() === 'KAKAO');
	}, []);

	if (!isVisible) return null;

	return (
		<span className="-top-2.5 pointer-events-none absolute right-3 rounded-full bg-primary-normal px-2 py-0.5 font-semibold text-caption1 text-white">
			최근 로그인
		</span>
	);
};
