'use client';

import { ClarityPageViewTracker } from '@/components/clarity-page-view-tracker';
import { CLARITY_ACTION_ID } from '@/constants/clarity';
import { useAuth } from '@/providers/auth-provider';

export const HomeViewTracker = () => {
	const { user } = useAuth();
	// 인증 완료 안내로 이동하는 경우 홈 방문으로 집계하지 않는다.
	const canTrackHomeView = user !== null && user.hasSeenApprovalWelcome !== false;

	return canTrackHomeView ? (
		<ClarityPageViewTracker action={CLARITY_ACTION_ID.HOME.VIEWED} />
	) : null;
};
