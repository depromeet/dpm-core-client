'use client';

import type { AttendanceReponse } from '@dpm-core/api';
import { SessionItem } from './attendance-session-item';

interface AttendanceSessionListProps {
	sessions: AttendanceReponse['sessions'];
}

export const AttendanceSessionList = (props: AttendanceSessionListProps) => {
	const { sessions } = props;

	return (
		<section className="px-4">
			{sessions.map((session) => (
				<SessionItem key={session.id} {...session} />
			))}
		</section>
	);
};
