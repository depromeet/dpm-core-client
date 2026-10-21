'use client';

import { useEffect, useState } from 'react';
import type { LoginMethod } from '@dpm-core/api';

import { getLastLoginMethod } from '@/lib/last-login';

interface RecentLoginBadgeProps {
	/** 이 로그인 방식으로 마지막에 로그인했을 때만 배지를 보여준다. */
	method: LoginMethod;
}

/** 마지막으로 로그인한 방식의 버튼 위에만 노출하는 말풍선. 버튼 중앙에서 오른쪽으로 113.5px 띄운 위치(피그마 기준). */
export const RecentLoginBadge = ({ method }: RecentLoginBadgeProps) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(getLastLoginMethod() === method);
	}, [method]);

	if (!isVisible) return null;

	return (
		<div className="-translate-x-1/2 pointer-events-none absolute bottom-[calc(100%-14px)] left-[calc(50%+113.5px)] flex items-center justify-center rounded-full bg-primary-normal px-2 py-1.5">
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
