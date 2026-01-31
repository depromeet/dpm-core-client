'use client';

import { useEffect } from 'react';

export const usePreventPageExit = (enabled: boolean) => {
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (!enabled) return;
			e.preventDefault();
			e.returnValue = '';
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, [enabled]);

	useEffect(() => {
		if (!enabled) return;

		const handlePopState = () => {
			if (window.confirm('작성 중인 내용이 있습니다. 정말 나가시겠습니까?')) {
				// 사용자가 확인하면 뒤로가기 허용
				return;
			}
			// 사용자가 취소하면 뒤로가기 방지
			window.history.pushState(null, '', window.location.href);
		};

		// 현재 상태를 히스토리에 추가하여 뒤로가기 감지 가능하게 함
		window.history.pushState(null, '', window.location.href);
		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	}, [enabled]);
};
