'use client';

import { useCallback, useEffect, useState } from 'react';
import { useIsFetching, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Member } from '@dpm-core/api';
import { useAppShell } from '@dpm-core/shared';

import { showAttendanceBanner } from '@/lib/attendance/banner';
import { useAuth } from '@/providers/auth-provider';
import { getAnnouncementListQuery } from '@/remotes/queries/announcement';
import {
	getAttendanceMeBySessionIdOptions,
	getMyAbsenceReasonOptions,
} from '@/remotes/queries/attendance';
import { getMyProfileQuery } from '@/remotes/queries/member';
import { getSessionCurrentOptions } from '@/remotes/queries/session';
import { getMyPendingSessionFeedbackQuery } from '@/remotes/queries/session-feedback';

import { HomeCoachmarkTour } from './home-coachmark-tour';

export const HomeCoachmark = () => {
	const { isAuthenticated, user } = useAuth();
	if (!isAuthenticated || !user) return null;
	return <HomeCoachmarkSession key={user.email} member={user} />;
};

interface HomeCoachmarkSessionProps {
	member: Member;
}

const HomeCoachmarkSession = ({ member }: HomeCoachmarkSessionProps) => {
	const { ref: shellRef } = useAppShell();

	const queryClient = useQueryClient();

	const profile = useQuery(getMyProfileQuery);
	const session = useQuery(getSessionCurrentOptions());

	const bannerFetchingCount = useIsFetching({
		predicate: ({ queryKey }) =>
			queryKey[0] === getAnnouncementListQuery.queryKey[0] ||
			queryKey[0] === getMyPendingSessionFeedbackQuery().queryKey[0] ||
			(queryKey[0] === 'ATTENDANCE' && queryKey[1] === 'absence-reason'),
	});
	const current = session.data?.data;
	const attendanceFetchingCount = useIsFetching(
		current?.status === 'AVAILABLE' && current.session
			? {
					queryKey: getAttendanceMeBySessionIdOptions({ sessionId: current.session.id }).queryKey,
					exact: true,
				}
			: { predicate: () => false },
	);

	const [status, setStatus] = useState<'checking' | 'active' | 'completed'>('checking');
	// Member 응답에는 회원 ID가 없어 기존 인증 식별값인 email로 계정을 구분한다.
	const storageKey = `home-coachmark:v1:${member.email}`;
	const isReady =
		member.status === 'ACTIVE' &&
		profile.isSuccess &&
		!profile.isFetching &&
		!profile.data.data.profileCompletionRequired &&
		session.isSuccess &&
		!session.isFetching &&
		attendanceFetchingCount === 0 &&
		bannerFetchingCount === 0;

	useEffect(() => {
		if (!isReady || status !== 'checking' || !session.data) return;
		const current = session.data.data;
		const shell = shellRef.current;
		if (!shell) return;

		const startWhenRendered = () => {
			// Suspense의 query 완료와 실제 DOM 커밋은 같은 시점이 아닐 수 있다.
			// 프로필 시트는 닫힘 애니메이션으로 DOM에서 제거될 때까지 기다린다.
			if (shell.querySelector('output, [data-slot="drawer-content"]')) return;
			if (current.status === 'AVAILABLE' && current.session) {
				if (!shell.querySelector('[data-coachmark="session-info"]')) return;
				const { attendanceStart, lateStart, absentStart, id } = current.session;
				if (showAttendanceBanner(attendanceStart, lateStart, absentStart)) {
					const attendanceQueryKey = getAttendanceMeBySessionIdOptions({ sessionId: id }).queryKey;
					const attendance = queryClient.getQueryState(attendanceQueryKey);
					if (!attendance || attendance.status === 'pending') return;
					const attendanceData = queryClient.getQueryData(attendanceQueryKey);
					const absenceReasonKey = getMyAbsenceReasonOptions({ sessionId: id }).queryKey;
					const absenceReason = queryClient.getQueryState(absenceReasonKey);
					if (!absenceReason || absenceReason.status === 'pending') return;
					const absenceReasonData = queryClient.getQueryData(absenceReasonKey);
					if (
						attendanceData?.data.attendance.status === 'PENDING' &&
						absenceReasonData?.data?.status !== 'PENDING' &&
						!shell.querySelector('[data-coachmark="attendance-check"]')
					)
						return;
				}
			}
			try {
				setStatus(window.localStorage.getItem(storageKey) === 'completed' ? 'completed' : 'active');
			} catch {
				// 저장소가 차단되어도 현재 방문에서는 안내를 사용할 수 있다.
				setStatus('active');
			}
		};

		const observer = new MutationObserver(startWhenRendered);
		observer.observe(shell, { childList: true, subtree: true });
		startWhenRendered();
		return () => observer.disconnect();
	}, [isReady, status, storageKey, shellRef, session.data, queryClient]);

	const handleComplete = useCallback(() => {
		setStatus('completed');
		try {
			window.localStorage.setItem(storageKey, 'completed');
		} catch {
			// 현재 방문의 완료 상태는 유지한다.
		}
	}, [storageKey]);

	if (status !== 'active' || profile.data?.data.profileCompletionRequired === true) return null;
	return <HomeCoachmarkTour onComplete={handleComplete} />;
};
