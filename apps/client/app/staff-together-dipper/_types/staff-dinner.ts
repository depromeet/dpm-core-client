export type AttendanceStatus = 'attending' | 'not-attending' | null;

export type PageState = 'form' | 'complete' | 'view';

export interface StaffDinnerInfo {
	id: number;
	title: string;
	description: string;
	staffDinnerDate: string;
	dueDate: string;
	inviteVariation: string[];
	isClosed: boolean;
}
