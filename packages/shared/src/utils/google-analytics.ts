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

// 세션 시작
export const gaTrackSessionStart = (sessionId: string) => {
	ReactGA.event('session_start', {
		session_id: sessionId,
	});
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

// 출석 코드 입력 페이지 진입
export const gaTrackAttendanceEnter = (sessionId: string) => {
	ReactGA.event('attendance_enter', {
		session_id: sessionId,
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

// 정산서 생성
export const gaTrackSettlementCreated = (
	settlementId: string,
	totalRounds: number,
	targetMemberCount: number,
	createdAt: string,
) => {
	ReactGA.event('settlement_created', {
		settlement_id: settlementId,
		total_rounds: totalRounds,
		target_member_count: targetMemberCount,
		created_at: createdAt,
	});
};

// 정산서 링크 공유 버튼 클릭
export const gaTrackSettlementLinkShare = (settlementId: string) => {
	ReactGA.event('settlement_link_share', {
		settlement_id: settlementId,
	});
};

// 멤버 최종 확정 버튼 클릭
export const gaTrackSettlementMemberConfirm = (
	settlementId: string,
	confirmedMemberCount: number,
	targetMemberCount: number,
	confirmedAt: string,
) => {
	ReactGA.event('settlement_member_confirm', {
		settlement_id: settlementId,
		confirmed_member_count: confirmedMemberCount,
		target_member_count: targetMemberCount,
		confirmed_at: confirmedAt,
	});
};

// 최종 정산서 링크 복사
export const gaTrackSettlementFinalLinkCopy = (settlementId: string) => {
	ReactGA.event('settlement_final_link_copy', {
		settlement_id: settlementId,
	});
};

// 정산서 확인 (참여 여부 제출 전)
export const gaTrackSettlementView = (settlementId: string) => {
	ReactGA.event('settlement_view', {
		settlement_id: settlementId,
	});
};

// 참석 여부 제출
export const gaTrackSettlementChoicesSubmit = (settlementId: string) => {
	ReactGA.event('settlement_choices_submit', {
		settlement_id: settlementId,
	});
};

// 최종 정산서 확인 (확정 후)
export const gaTrackSettlementFinalView = (settlementId: string) => {
	ReactGA.event('settlement_final_view', {
		settlement_id: settlementId,
	});
};

// 최종 정산서 계좌 복사
export const gaTrackSettlementPayAccount = (settlementId: string, amount: number) => {
	ReactGA.event('settlement_pay_account', {
		settlement_id: settlementId,
		amount: amount,
	});
};
