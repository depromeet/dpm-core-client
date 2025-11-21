export interface Session {
	id: number;
	week: number;
	name: string;
	place: string;
	isOnline: boolean;
	date: string;
}

export interface SessionAttendanceStatusTime {
	attendanceStart: string;
	lateStart: string;
	absentStart: string;
}

export interface SessionAttendanceCode {
	attendanceCode: string;
}
