import { type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type {
	Announcement,
	MyAbsenceReasonResponse,
	MyAttendanceBySessionIdResponse,
	NextSessionHomeResponse,
	SessionFeedbackPending,
} from '@dpm-core/api';
import { Toaster } from '@dpm-core/shared';

import { getAnnouncementListQuery } from '@/remotes/queries/announcement';
import {
	getAttendanceMeBySessionIdOptions,
	getMyAbsenceReasonOptions,
} from '@/remotes/queries/attendance';
import { getSessionCurrentOptions } from '@/remotes/queries/session';
import { getMyPendingSessionFeedbackQuery } from '@/remotes/queries/session-feedback';

import type { AttendanceCheckBottomSheetOptions } from '../_components/attendance-check-bottom-sheet';
import { HomeAnnouncementBanner } from '../_components/home-announcement-banner';
import { HomeBannerList } from '../_components/home-banner-list';
import { HomeScreen } from '../_components/home-screen';
import { makeAttendanceSubmission } from './attendance-sheet.fixtures';
import {
	HOME_CLOCK,
	homeAnnouncement,
	homePendingFeedback,
	homeResponse,
	homeSession,
	homeSessionItem,
	makeAttendance,
} from './home-cases';

type MockResult<T> = T | 'loading' | 'failed';

export interface HomeScenario {
	now?: string;
	announcements?: MockResult<Announcement[]>;
	session?: MockResult<NextSessionHomeResponse>;
	feedback?: MockResult<SessionFeedbackPending | null>;
	attendance?: MockResult<MyAttendanceBySessionIdResponse>;
	absenceReason?: MockResult<MyAbsenceReasonResponse | null>;
	attendanceSheet?: AttendanceCheckBottomSheetOptions;
}

export interface HomePreviewProps {
	scenario?: HomeScenario;
	afterTabBar?: ReactNode;
}

const pending = new Promise<never>(() => undefined);
const ignoreSessionView = () => undefined;

const attendanceResultAt = (now: string) => {
	const time = Date.parse(now);
	if (time >= Date.parse(HOME_CLOCK.lateParticipation)) return 'ABSENT';
	if (time >= Date.parse(HOME_CLOCK.lateOpen)) return 'LATE';
	return 'PRESENT';
};

const mockQuery =
	<T, R>(result: MockResult<T>, format: (value: T) => R): (() => Promise<R>) =>
	() => {
		if (result === 'loading') return pending;
		if (result === 'failed') return Promise.reject(new Error('홈 화면 조회 실패'));
		return Promise.resolve(format(result));
	};

export const HomePreview = ({
	scenario: {
		now = HOME_CLOCK.beforeAttendance,
		announcements = [homeAnnouncement],
		session = homeSession,
		feedback = homePendingFeedback,
		attendance = makeAttendance('PENDING'),
		absenceReason = null,
		attendanceSheet,
	} = {},
	afterTabBar,
}: HomePreviewProps) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: { retry: false, staleTime: Infinity },
				},
			}),
	);
	const sessionId =
		typeof session === 'string' ? homeSessionItem.id : (session.session?.id ?? homeSessionItem.id);

	return (
		<QueryClientProvider client={queryClient}>
			<HomeScreen afterTabBar={afterTabBar}>
				<HomeAnnouncementBanner
					query={{
						...getAnnouncementListQuery,
						queryFn: mockQuery(announcements, (items) =>
							homeResponse({ announcementCount: items.length, announcements: items }),
						),
					}}
				/>
				<HomeBannerList
					query={{ ...getSessionCurrentOptions(), queryFn: mockQuery(session, homeResponse) }}
					feedbackQuery={{
						...getMyPendingSessionFeedbackQuery(),
						enabled: true,
						queryFn: mockQuery(feedback, (value) => homeResponse(value ?? undefined)),
					}}
					attendanceQueries={{
						attendance: {
							...getAttendanceMeBySessionIdOptions({ sessionId }),
							queryFn: mockQuery(attendance, homeResponse),
						},
						absenceReason: {
							...getMyAbsenceReasonOptions({ sessionId }),
							queryFn: mockQuery(absenceReason, homeResponse),
						},
					}}
					attendanceSheet={
						attendanceSheet ?? makeAttendanceSubmission(attendanceResultAt(now), now)
					}
					currentTime={now}
					onSessionView={ignoreSessionView}
				/>
			</HomeScreen>
			<Toaster position="top-center" visibleToasts={1} />
		</QueryClientProvider>
	);
};
