'use client';

import { useEffect } from 'react';
import { trackHomeEnter, trackSessionEnter } from '../../utils/analytics';

interface PageTrackerProps {
	type: 'home' | 'session' | 'session-detail';
	sessionId?: string;
}

export const PageTracker = ({ type, sessionId }: PageTrackerProps) => {
	useEffect(() => {
		switch (type) {
			case 'home':
				trackHomeEnter('home');
				break;
			case 'session':
				trackSessionEnter('session-list');
				break;
			case 'session-detail':
				if (sessionId) {
					trackSessionEnter(sessionId);
				}
				break;
		}
	}, [type, sessionId]);

	return null; // 렌더링하지 않는 트래킹 전용 컴포넌트
};