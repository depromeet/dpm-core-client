'use client';

import { useEffect } from 'react';

import { gaTrackHomeEnter, gaTrackSessionEnter } from '../../utils/google-analytics';

interface GAPageTrackerProps {
	type: 'home' | 'session' | 'session-detail';
	sessionId?: string;
}

export const GAPageTracker = ({ type, sessionId }: GAPageTrackerProps) => {
	useEffect(() => {
		switch (type) {
			case 'home':
				gaTrackHomeEnter('home');
				break;
			case 'session':
				gaTrackSessionEnter('session-list');
				break;
			case 'session-detail':
				if (sessionId) {
					gaTrackSessionEnter(sessionId);
				}
				break;
		}
	}, [type, sessionId]);

	return null; // 렌더링하지 않는 GA 트래킹 전용 컴포넌트
};
