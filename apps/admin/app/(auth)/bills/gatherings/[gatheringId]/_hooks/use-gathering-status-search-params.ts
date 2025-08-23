import { useRouter, useSearchParams } from 'next/navigation';
import z from 'zod';
import { ATTEND_STATUS } from './../const/attend-status';

const attendStatusSchema = z.enum(ATTEND_STATUS).catch(ATTEND_STATUS.ALL);

export const useGatheringStatusSearchParams = () => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const attendStatus = attendStatusSchema.parse(searchParams.get('attendStatus'));

	const handleFilterStatus = (value: string) => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set('attendStatus', value);
		router.replace(`?${newSearchParams.toString()}`);
	};

	return { attendStatus, handleChange: handleFilterStatus };
};
