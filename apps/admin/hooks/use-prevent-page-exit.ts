'use client';

import { useEffect, useRef } from 'react';

export const usePreventPageExit = (enabled: boolean) => {
	const pushedRef = useRef(false);

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
				window.removeEventListener('popstate', handlePopState);
				pushedRef.current = false;
				window.history.back();
				return;
			}
			window.history.pushState(null, '', window.location.href);
		};

		if (!pushedRef.current) {
			window.history.pushState(null, '', window.location.href);
			pushedRef.current = true;
		}
		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	}, [enabled]);
};
