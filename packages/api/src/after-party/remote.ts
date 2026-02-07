import { http } from '../http';
import type { GetAfterPartiesResponse } from './types';

export const afterParty = {
	getAfterParties: async () => {
		const res = await http.get<GetAfterPartiesResponse>('v2/gatherings');
		return res;
	},
};
