'use client';

import type { MyAttendanceSession } from '@dpm-core/api';
import { Accordion } from '@dpm-core/shared';

import { SessionItem } from './attendance-session-item';

interface AttendanceSessionListProps {
	sessions: MyAttendanceSession[];
}

export const AttendanceSessionList = (props: AttendanceSessionListProps) => {
	const { sessions } = props;

	return (
		<section className="px-4">
			<Accordion type="single">
				{sessions.map((session) => (
					<SessionItem key={session.id} {...session} />
				))}
			</Accordion>
		</section>
	);
};
