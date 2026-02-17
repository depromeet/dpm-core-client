import { http } from '../http';
import type {
	CreateAfterPartyRequest,
	CreateAfterPartyResponse,
	GetAfterPartiesResponse,
} from './types';

export const afterParty = {
	getAfterParties: async () => {
		const res = await http.get<GetAfterPartiesResponse>('v2/gatherings');
		return res;
	},

	createAfterParty: async (params: CreateAfterPartyRequest) => {
		console.log('API params', params);
		const res = await http.post<CreateAfterPartyResponse>('v2/gatherings', { json: params });
		return res;
	},
};
