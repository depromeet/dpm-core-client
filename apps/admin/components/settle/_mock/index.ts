export type SettleStatus = 'before' | 'progress' | 'done';

export interface SettleItem {
	id: string;
	title: string;
	date: string;
	round?: string;
	count?: string;
	status: SettleStatus;
}

export const settleMockData: SettleItem[] = [
	{
		id: '1',
		title: '코어 1기 UT 후 회식',
		date: '25년 8월 12일 (토)',
		round: '~3차',
		count: '27/48명 제출',
		status: 'before',
	},
	{
		id: '2',
		title: '코어 1기 UT 후 회식',
		date: '25년 8월 12일 (토)',
		round: '~3차',
		count: '48명',
		status: 'progress',
	},
	{
		id: '3',
		title: '코어 1기 UT 후 회식',
		date: '25년 8월 12일 (토)',
		round: '~3차',
		count: '대상자 48명',
		status: 'done',
	},
];
