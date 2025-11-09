export type Part = 'WEB' | 'ANDROID' | 'IOS' | 'DESIGN' | 'SERVER' | 'ETC';

export interface Member {
	email: string;
	name: string;

	/**
	 * number to string
	 */
	cohort: string;

	part: Part;
	teamNumber: number;

	isAdmin: boolean;
}
