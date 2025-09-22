'use client';

import { gaTrackMyPageEnter } from '@dpm-core/shared';
import { useEffect } from 'react';

export const MyPageTracker = () => {
	useEffect(() => {
		gaTrackMyPageEnter();
	}, []);

	return null;
};