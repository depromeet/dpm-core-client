'use client';

import { useIntersect } from './useIntersect';

interface UseInfiniteScrollOptions {
	callback: () => unknown;
	canObserve: boolean;
	enabled: boolean;
}

export const useInfiniteScroll = ({
	callback,
	canObserve,
	enabled,
}: UseInfiniteScrollOptions) => {
	const { targetRef } = useIntersect({
		onIntersect: (entry, observer) => {
			if (!canObserve) {
				observer.unobserve(entry.target);
				return;
			}

			if (entry.isIntersecting && canObserve && enabled) {
				callback();
			}
		},
	});

	return { targetRef };
};
