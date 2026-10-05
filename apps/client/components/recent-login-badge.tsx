'use client';

import { useEffect, useState } from 'react';

import { getLastLoginMethod } from '@/lib/last-login';

/** 카카오로 마지막 로그인한 경우에만 카카오 버튼 위에 말풍선으로 노출한다. */
export const RecentLoginBadge = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(getLastLoginMethod() === 'KAKAO');
	}, []);

	if (!isVisible) return null;

	return (
		<div className="pointer-events-none absolute right-4 bottom-full mb-2.5 flex items-center justify-center rounded-full bg-primary-normal px-2 py-1.5">
			<span className="whitespace-nowrap font-medium text-caption1 text-white">최근 로그인</span>
			<svg
				width="12"
				height="5"
				viewBox="0 0 12 5"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="-translate-x-1/2 absolute bottom-[-5px] left-1/2 text-primary-normal"
				aria-hidden="true"
			>
				<path d="M0 0H12L7.2 4.2C6.5 4.8 5.5 4.8 4.8 4.2L0 0Z" fill="currentColor" />
			</svg>
		</div>
	);
};
