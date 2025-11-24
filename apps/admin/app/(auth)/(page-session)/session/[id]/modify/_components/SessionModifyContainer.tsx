'use client';

import { Suspense, useRef, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { SessionProivder } from '@/app/(auth)/(home)/_components/session-provider';
import { formatTimeToCode } from '@/app/(auth)/(split-session)/session/_utils';
import { LoadingBox } from '@/components/loading-box';
import { getSessionDetailQuery } from '@/remotes/queries/session';

import { subtractOneMinute } from '../../../_utils';
import { SessionForm, type SessionSchema } from '../../../create/_components/SessionForm';
import { SessionPolicyModal } from './SessionPolicyModal';

interface SessionModifyContainerProps {
	sessionId: number;
}

export const SessionModifyContainer = (props: SessionModifyContainerProps) => {
	const { sessionId } = props;

	const {
		data: { data: sessionDetail },
	} = useSuspenseQuery(getSessionDetailQuery(sessionId));

	const [isSessionPolicyModalOpen, setIsSessionPolicyModalOpen] = useState(false);

	const SessionFormData = useRef<SessionSchema | null>(null);

	const handleOpenSessionPolicyModal = (formData: SessionSchema) => {
		SessionFormData.current = formData;
		setIsSessionPolicyModalOpen(true);
	};

	return (
		<SessionProivder>
			<SessionForm
				onSubmit={handleOpenSessionPolicyModal}
				defaultValues={{
					cohortId: 1,
					name: sessionDetail.name,
					sessionDate: {
						date: new Date(sessionDetail.date),
						time: formatTimeToCode(sessionDetail.date),
					},
					week: String(sessionDetail.week),
					isOnline: sessionDetail.isOnline ? 'online' : 'offline',
					place: sessionDetail.place,
					attendancePresentTime: {
						start: formatTimeToCode(sessionDetail.attendanceStart),
						end: '',
					},
					attendanceLateTime: {
						start: formatTimeToCode(sessionDetail.lateStart),
						end: subtractOneMinute(formatTimeToCode(sessionDetail.absentStart)),
					},
				}}
			/>
			{isSessionPolicyModalOpen && SessionFormData.current && (
				<Suspense fallback={<LoadingBox />}>
					<SessionPolicyModal
						formData={SessionFormData.current}
						sessionId={sessionId}
						open={isSessionPolicyModalOpen}
						onOpenChange={setIsSessionPolicyModalOpen}
					/>
				</Suspense>
			)}
		</SessionProivder>
	);
};
