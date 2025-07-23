import { useCallback, useRef } from 'react';

// biome-ignore lint/suspicious/noExplicitAny: usage of 'any' is required for generic function arguments
export function useDebounce<T extends (...args: any[]) => void>(
	callback: T,
	delay: number,
): (...args: Parameters<T>) => void {
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	return useCallback(
		(...args: Parameters<T>) => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}

			timerRef.current = setTimeout(() => {
				callback(...args);
			}, delay);
		},
		[callback, delay],
	);
}
