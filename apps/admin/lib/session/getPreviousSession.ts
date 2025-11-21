import type { Session, SessionAttendanceCode } from '@dpm-core/api';

export const getPreviousSession = (
	sessions: Session[],
	currentSessionWeek: (Session & SessionAttendanceCode) | null,
) => {
	if (!sessions?.length || !currentSessionWeek) return null;

	const prevWeek = currentSessionWeek.week - 1;
	if (prevWeek < 1) return null;

	const prevSession = sessions.find((session) => session.week === prevWeek);
	if (!prevSession) return null;

	return prevSession;
};
