'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import z from 'zod';

const afterPartyAttendeesStatusSchema = z.enum(['YES', 'NO']).catch('YES');

const afterPartyAttendeesIsMyTeamSchema = z
	.enum(['true', 'false'])
	.transform((v) => v === 'true')
	.catch(false);

const useAfterPartyAttendeesFilterSearchParams = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const afterPartyAttendeesStatus = afterPartyAttendeesStatusSchema.parse(
		searchParams.get('afterPartyAttendeesStatus'),
	);

	const afterPartyAttendeesIsMyTeam = afterPartyAttendeesIsMyTeamSchema.parse(
		searchParams.get('afterPartyAttendeesIsMyTeam'),
	);

	const updateSearchParams = (updater: (params: URLSearchParams) => void) => {
		const newSearchParams = new URLSearchParams(searchParams);
		updater(newSearchParams);
		router.replace(`?${newSearchParams.toString()}`);
	};

	return {
		afterPartyAttendeesStatus,
		afterPartyAttendeesIsMyTeam,
		handleChangeSAfterPartyAttendeesStatus: (value: string) => {
			updateSearchParams((params) => {
				params.set('afterPartyAttendeesStatus', value);
			});
		},
		handleChangeAfterPartyAttendeesIsMyTeam: (checked: boolean) => {
			updateSearchParams((params) => {
				if (checked) {
					params.set('afterPartyAttendeesIsMyTeam', 'true');
				} else {
					params.delete('afterPartyAttendeesIsMyTeam');
				}
			});
		},
	};
};

export { useAfterPartyAttendeesFilterSearchParams };
