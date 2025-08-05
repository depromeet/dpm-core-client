'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import z from 'zod';

const billStatusSchema = z.enum(['ALL', 'OPEN', 'IN_PROGRESS', 'COMPLETED']).catch('ALL');

const useBillStatusSearchParams = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const billStatus = billStatusSchema.parse(searchParams.get('billStatus'));
	return {
		billStatus,
		handleChange: (value: string) => {
			const newSearchParams = new URLSearchParams(searchParams);
			newSearchParams.set('billStatus', value);
			router.push(`/bills?${newSearchParams.toString()}`);
		},
	};
};

export { useBillStatusSearchParams };
