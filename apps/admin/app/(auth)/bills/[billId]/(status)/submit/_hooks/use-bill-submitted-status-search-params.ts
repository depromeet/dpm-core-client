import { useRouter, useSearchParams } from 'next/navigation';

import z from 'zod';

const submitStatusSchema = z.enum(['SUBMIT', 'UNSUBMIT']).catch('SUBMIT');

export const useBillSubmittedStatusSearchParams = () => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const submitStatus = submitStatusSchema.parse(searchParams.get('submitStatus'));

	const handleFilterSubmitStatus = (value: string) => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set('submitStatus', value);
		router.replace(`?${newSearchParams.toString()}`);
	};

	return { submitStatus, handleChange: handleFilterSubmitStatus };
};
