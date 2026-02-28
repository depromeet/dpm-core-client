'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import z from 'zod';

const afterPartyParticipantsStatusSchema = z.enum(['YES', 'NO']).catch('NO');

const afterPartyParticipantsIsMyTeamSchema = z
	.enum(['true', 'false'])
	.transform((v) => v === 'true')
	.catch(false);

const useAfterPartyParticipantsFilterSearchParams = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const afterPartyParticipantsStatus = afterPartyParticipantsStatusSchema.parse(
		searchParams.get('afterPartyParticipantsStatus'),
	);

	const afterPartyParticipantsIsMyTeam = afterPartyParticipantsIsMyTeamSchema.parse(
		searchParams.get('afterPartyParticipantsIsMyTeam'),
	);

	const updateSearchParams = (updater: (params: URLSearchParams) => void) => {
		const newSearchParams = new URLSearchParams(searchParams);
		updater(newSearchParams);
		router.replace(`?${newSearchParams.toString()}`);
	};

	return {
		afterPartyParticipantsStatus,
		afterPartyParticipantsIsMyTeam,
		handleChangeSAfterPartyParticipantsStatus: (value: string) => {
			updateSearchParams((params) => {
				params.set('afterPartyParticipantsStatus', value);
			});
		},
		handleChangeAfterPartyParticipantsIsMyTeam: (checked: boolean) => {
			updateSearchParams((params) => {
				if (checked) {
					params.set('afterPartyParticipantsIsMyTeam', 'true');
				} else {
					params.delete('afterPartyParticipantsIsMyTeam');
				}
			});
		},
	};
};

export { useAfterPartyParticipantsFilterSearchParams };
