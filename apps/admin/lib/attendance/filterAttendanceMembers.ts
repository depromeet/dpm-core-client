import type { AttendanceBySessionMember } from '@dpm-core/api';

interface AttendanceMemberFilters {
	statuses?: string[];
	teams?: number[];
	name?: string;
}

export const filterAttendanceMembers = (
	members: AttendanceBySessionMember[],
	filters: AttendanceMemberFilters,
) => {
	const name = filters.name?.trim().toLocaleLowerCase();

	return members.filter((member) => {
		if (filters.statuses?.length && !filters.statuses.includes(member.attendanceStatus)) {
			return false;
		}

		if (filters.teams?.length && !filters.teams.includes(member.teamNumber ?? 0)) {
			return false;
		}

		return !name || member.name.toLocaleLowerCase().includes(name);
	});
};
