'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import z from 'zod';

const afterPartyStatusSchema = z.enum(['ALL', 'IN_PROGRESS']).catch('ALL');

const useAfterPartyListFilterSearchParams = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const afterPartyStatus = afterPartyStatusSchema.parse(searchParams.get('afterPartyStatus'));
	return {
		afterPartyStatus,
		handleChange: (value: string) => {
			const newSearchParams = new URLSearchParams(searchParams);
			newSearchParams.set('afterPartyStatus', value);
			router.push(`/after-party?${newSearchParams.toString()}`);
		},
	};
};

export { useAfterPartyListFilterSearchParams };
