'use client';

import { useSuspenseQueries } from '@tanstack/react-query';
import type { Session, SessionAttendanceCode } from '@dpm-core/api';
import { createContext } from '@dpm-core/shared';

import { getCurrentWeekSessionQuery, getSessionListQuery } from '@/remotes/queries/session';

interface SessionContext {
	sessions: Session[];
	currentSessionWeek: (Session & SessionAttendanceCode) | null;
}

const [SessionProviderContext, useSession] = createContext<SessionContext>('Week', undefined);

const SessionProivder = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const [
		{
			data: { data: sessions },
		},
		{
			data: { data: currentSessionWeek },
		},
	] = useSuspenseQueries({
		queries: [getSessionListQuery, getCurrentWeekSessionQuery],
	});

	return (
		<SessionProviderContext sessions={sessions.sessions} currentSessionWeek={currentSessionWeek}>
			{children}
		</SessionProviderContext>
	);
};

export { SessionProivder, useSession };
