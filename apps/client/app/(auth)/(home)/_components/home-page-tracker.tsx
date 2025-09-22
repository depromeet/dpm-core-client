'use client';

import { gaTrackHomeEnter } from '@dpm-core/shared';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { session } from '@dpm-core/api';

export const HomePageTracker = () => {
	const { data: currentWeekSession } = useSuspenseQuery({
		queryKey: ['session-current-week'],
		queryFn: async () => {
			const { data: currentWeekSession } = await session.getCurrentWeekSession();
			return currentWeekSession;
		},
		gcTime: 0,
	});

	useEffect(() => {
		const sessionId = currentWeekSession?.sessionId?.toString() || 'home';
		gaTrackHomeEnter(sessionId);
	}, [currentWeekSession]);

	return null;
};