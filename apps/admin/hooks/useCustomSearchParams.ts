'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export const useCustomSearchParams = () => {
	const router = useRouter();
	const _searchParams = useSearchParams();
	const searchParams = new URLSearchParams(_searchParams);

	const get = (name: string): string | null => {
		return searchParams.get(name);
	};

	const getAll = () => {
		return Object.fromEntries(searchParams.entries());
	};

	const add = (params: Record<string, string>) => {
		for (const key of Object.keys(params)) {
			if (params[key]) {
				searchParams.set(key, params[key]);
			} else {
				searchParams.delete(key);
			}
		}
		return Object.fromEntries(searchParams.entries());
	};

	const update = (params: Record<string, string>, options: 'REPLACE' | 'PUSH') => {
		for (const key of Object.keys(params)) {
			if (params[key]) {
				searchParams.set(key, params[key]);
			} else {
				searchParams.delete(key);
			}
		}

		if (options === 'PUSH') {
			router.push(`?${searchParams.toString()}`);
		}
		if (options === 'REPLACE') {
			router.replace(`?${searchParams.toString()}`);
		}
	};

	return { get, getAll, add, update };
};
