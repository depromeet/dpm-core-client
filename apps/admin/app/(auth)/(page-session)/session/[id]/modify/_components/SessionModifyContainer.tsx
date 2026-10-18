'use client';

import { useRef, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { SessionProivder } from '@/app/(auth)/(home)/_components/session-provider';
import { formatTimeToCode } from '@/app/(auth)/(split-session)/session/_utils';
import { getSessionDetailQuery } from '@/remotes/queries/session';

import { subtractOneMinute } from '../../../_utils';
import { SessionForm, type SessionSchema } from '../../../create/_components/SessionForm';
import { SessionModifyConfirmModal } from './SessionModifyConfirmModal';

interface SessionModifyContainerProps {
	sessionId: number;
}

export const SessionModifyContainer = (props: SessionModifyContainerProps) => {
	const { sessionId } = props;

	const {
		data: { data: sessionDetail },
	} = useSuspenseQuery(getSessionDetailQuery(sessionId));

	const [isModifyConfirmModalOpen, setIsModifyConfirmModalOpen] = useState(false);

	const SessionFormData = useRef<SessionSchema | null>(null);

	const handleOpenModifyConfirmModal = (formData: SessionSchema) => {
		SessionFormData.current = formData;
		setIsModifyConfirmModalOpen(true);
	};

	return (
		<SessionProivder>
			<SessionForm
				onSubmit={handleOpenModifyConfirmModal}
				showFeedbackSettings
				excludeSessionId={sessionId}
				feedbackSettingsLocked={
					sessionDetail.feedback?.status === 'IN_PROGRESS' ||
					sessionDetail.feedback?.status === 'CLOSED'
				}
				feedbackStartAtInitialValue={sessionDetail.feedback?.startAt}
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
					feedbackEnabled: sessionDetail.feedback !== null,
					feedbackPushEnabled: sessionDetail.feedback?.pushEnabled ?? true,
					feedbackStartAt: {
						date: sessionDetail.feedback ? new Date(sessionDetail.feedback.startAt) : null,
						time: sessionDetail.feedback ? formatTimeToCode(sessionDetail.feedback.startAt) : '',
					},
				}}
			/>
			{isModifyConfirmModalOpen && SessionFormData.current && (
				<SessionModifyConfirmModal
					formData={SessionFormData.current}
					initialAttendanceTimes={{
						attendanceStart: sessionDetail.attendanceStart,
						lateStart: sessionDetail.lateStart,
						absentStart: sessionDetail.absentStart,
					}}
					sessionId={sessionId}
					open={isModifyConfirmModalOpen}
					onOpenChange={setIsModifyConfirmModalOpen}
				/>
			)}
		</SessionProivder>
	);
};
