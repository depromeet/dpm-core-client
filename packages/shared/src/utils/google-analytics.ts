'use client';

import ReactGA from 'react-ga4';

import { GA_ID } from '../constants/google-analytics';

// GA4 초기화
export const gaInit = () => {
	ReactGA.initialize(GA_ID);
};

// 페이지 뷰 추적
export const gaTrackPageView = (page: string) => {
	ReactGA.send({ hitType: 'pageview', page });
};

// 세션 종료
export const gaTrackSessionEnd = (sessionId: string, duration: number) => {
	ReactGA.event('session_end', {
		session_id: sessionId,
		duration: duration,
	});
};

// 홈 화면 진입
export const gaTrackHomeEnter = (sessionId: string) => {
	ReactGA.event('home_enter', {
		session_id: sessionId,
	});
};

// 세션 페이지 진입
export const gaTrackSessionEnter = (sessionId: string) => {
	ReactGA.event('session_enter', {
		session_id: sessionId,
	});
};

// 마이페이지 진입
export const gaTrackMyPageEnter = () => {
	ReactGA.event('mypage_enter', {});
};

// 마이페이지 수정
export const gaTrackMyPageEditSuccess = (editedFields: string[]) => {
	ReactGA.event('mypage_edit_success', {
		edited_fields: editedFields.join(','),
	});
};

// 출석 코드 입력
export const gaTrackAttendanceSubmit = (sessionId: string, result: 'success' | 'fail') => {
	ReactGA.event('attendance_submit', {
		session_id: sessionId,
		result: result,
	});
};

// 출석 상태 수동 수정
export const gaTrackAttendanceOverride = (
	sessionId: string,
	memberId: string,
	beforeStatus: string,
	afterStatus: string,
) => {
	ReactGA.event('attendance_override', {
		session_id: sessionId,
		member_id: memberId,
		before_status: beforeStatus,
		after_status: afterStatus,
	});
};

// 출석/지각 시간 설정
export const gaTrackAttendanceTimeSet = (
	sessionId: string,
	startTime: string,
	lateTime: string,
) => {
	ReactGA.event('attendance_time_set', {
		session_id: sessionId,
		start_time: startTime,
		late_time: lateTime,
	});
};

// 세션 생성
export const gaTrackSessionCreated = (
	sessionId: string,
	date: string,
	sessionStartTime: string,
	sessionEndTime: string,
) => {
	ReactGA.event('session_created', {
		session_id: sessionId,
		date: date,
		session_start_time: sessionStartTime,
		session_end_time: sessionEndTime,
	});
};
