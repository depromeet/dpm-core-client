export type AttendanceStatus = 'attending' | 'not-attending' | null;

export type PageState = 'form' | 'complete' | 'view';

/**
 * AttendanceStatus ↔ API boolean 변환 유틸리티
 */
export const toRsvpGoing = (status: AttendanceStatus): boolean => {
	return status === 'attending';
};

export const fromRsvpStatus = (rsvpStatus: boolean | null): AttendanceStatus => {
	if (rsvpStatus === null) return null;
	return rsvpStatus ? 'attending' : 'not-attending';
};
