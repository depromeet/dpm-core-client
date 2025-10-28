import type { CurrentWeekSession, Session } from '@dpm-core/api';

export const getPreviousSession = (
	sessions: Session[],
	currentSessionWeek: CurrentWeekSession | null,
) => {
	if (!sessions?.length || !currentSessionWeek) return null;

	const prevWeek = currentSessionWeek.week - 1;
	if (prevWeek < 1) return null;

	// 이전 주차 session 찾기 (필요한 순간에 바로 종료)
	const prevSession = sessions.find((session) => session.week === prevWeek);
	if (!prevSession) return null;

	return prevSession;
};
