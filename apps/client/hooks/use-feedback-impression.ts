'use client';

import { useEffect, useRef } from 'react';

/** 실제 노출된 항목만 기록한다. 한 번 기록한 항목의 중복 관리는 호출자가 담당한다. */
export const useFeedbackImpression = <T extends HTMLElement>(
	enabled: boolean,
	onView: () => void,
) => {
	const elementRef = useRef<T>(null);

	useEffect(() => {
		const element = elementRef.current;
		if (!enabled || !element || typeof IntersectionObserver === 'undefined') return;

		let active = true;
		try {
			const observer = new IntersectionObserver(
				(entries) => {
					if (
						!active ||
						!entries.some(
							(entry) =>
								entry.target === element && entry.isIntersecting && entry.intersectionRatio >= 0.01,
						)
					)
						return;
					active = false;
					observer.disconnect();
					onView();
				},
				{ threshold: 0.01 },
			);
			observer.observe(element);
			return () => {
				active = false;
				observer.disconnect();
			};
		} catch {
			// 노출 확인 실패가 화면 렌더링에 영향을 주지 않도록 한다.
		}
	}, [enabled, onView]);

	return elementRef;
};
